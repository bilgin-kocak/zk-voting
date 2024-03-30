'use client';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { wait } from '@/lib/client-side/utils';
import type ZkappWorkerClient from '../zkappWorkerClient';
import { Button } from '@/components/button/Button';
import { Alert } from '@/components/alert/Alert';
import Candidates from './candidates/candidates';
import { useLocalStorage } from '@/hooks';
import { Nullifier, PrivateKey } from 'o1js';

let transactionFee = 0.1;

export default function Content() {
  const [alert, setAlert] = useState({
    message: '',
    error: false,
  });
  const [candidate, setCandidate] = useState(-1);
  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentBallot: null as null | any,
    publicKey: null as null | any,
    zkappPublicKey: null as null | any,
    connecting: false,
    voting: false,
    voted: false,
  });
  const [transactionlink, setTransactionLink] = useState('');
  const [electionResults, setElectionResults] = useLocalStorage(
    'electionResults',
    {
      candidates: Array(8).fill(0) as number[],
    }
  );

  useEffect(() => {
    (async () => {
      try {
        if (state.hasBeenSetup && !state.accountExists) {
          let accountExists = false;
          while (!accountExists) {
            console.log('Checking if fee payer account exists...');
            const res = await state.zkappWorkerClient!.fetchAccount({
              publicKey: state.publicKey!,
            });
            accountExists = res.error == null;
            await wait(5000);
          }
          setState((prev) => ({ ...prev, accountExists: true }));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [state.hasBeenSetup]);

  const onCastVote = async () => {
    try {
      setState((prev) => ({ ...prev, voting: true }));

      console.log('Creating a transaction...');

      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!,
      });

      const nullifier = await createNullifier();

      await state.zkappWorkerClient!.castVote({
        voteOption: candidate,
        nullifier: nullifier!,
      });

      console.log('New Offchain State Uploaded');

      console.log('Creating proof...');
      await state.zkappWorkerClient!.proveTransaction();

      console.log('Requesting send transaction...');
      const transactionJSON =
        await state.zkappWorkerClient!.getTransactionJSON();

      // console.log('Getting transaction JSON...');
      // const { hash } = await (window as any).mina.sendTransaction({
      //   transaction: transactionJSON,
      //   feePayer: {
      //     fee: transactionFee,
      //     memo: '',
      //   },
      // });

      // const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
      // console.log(`View transaction at ${transactionLink}`);
      // setTransactionLink(transactionLink);
      setState((prev) => ({ ...prev, voted: true }));
    } catch (error) {
      console.error(error);
      setAlert({ message: 'An error occurred', error: true });
    }
    setState((prev) => ({ ...prev, voting: false }));
  };

  const onConnect = async () => {
    try {
      if (!state.hasBeenSetup) {
        setState((prev) => ({
          ...prev,
          connecting: true,
        }));
        const { Mina, PublicKey, UInt32 } = await import('o1js');
        const { Votes } = await import('@/contracts/build/src/');
        const ZkappWorkerClient = (await import('@/app/zkappWorkerClient'))
          .default;
        const Berkeley = Mina.Network(
          'https://proxy.berkeley.minaexplorer.com/graphql'
        );
        Mina.setActiveInstance(Berkeley);

        console.log('Loading web worker...');
        const zkappWorkerClient = new ZkappWorkerClient();
        await wait(5000);

        console.log('Done loading web worker');
        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;
        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }
        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);
        console.log('using key', publicKey.toBase58());

        console.log('Checking if fee payer account exists...');

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });

        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();
        console.log('Compiling zkApp...');

        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        const zkappPublicKeyImported =
          process.env.NEXT_PUBLIC_ZK_APP_PUBLIC_KEY!;

        // /*const zkappPublicKeyImported = (
        //     await import("@/contracts/keys/berkeley.json")
        //   ).publicKey;*/

        // const zkappPublicKey = PublicKey.fromBase58(zkappPublicKeyImported);
        const zkappPublicKey = PublicKey.fromBase58(
          'B62qqn5neDForz8XymfRrZWEtV7Fww5fmLynx2iAnZUN5cM6ZGoJe8f'
        );
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('Getting zkApp state...');

        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });

        console.log('zkApp state fetched');

        await zkappWorkerClient.loadContract();

        console.log('Initializing zkApp...');

        let isInitialized = await zkappWorkerClient.getIsInitialized();
        console.log('isInitialized', isInitialized);

        if (isInitialized === 'true') {
          isInitialized = true;
        } else {
          isInitialized = false;
        }

        const nullifier = await createNullifier();

        await zkappWorkerClient.setOffchainInstance(nullifier);

        if (!isInitialized) {
          await zkappWorkerClient.initState();

          console.log('Creating proof...');
          await zkappWorkerClient!.proveTransaction();

          console.log('Requesting send transaction...');
          const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

          console.log('Getting transaction JSON...');
          const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
              fee: transactionFee,
              memo: '',
            },
          });

          const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
          console.log(`View transaction at ${transactionLink}`);
        } else {
          const currentVotingID = await zkappWorkerClient.getVotingID();

          console.log('currentVotingID', currentVotingID);
        }

        console.log('ZkApp initialized');
        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: 'An error occurred', error: true });
    }
    setState((prev) => ({
      ...prev,
      connecting: false,
    }));
  };

  const createNullifier = async () => {
    const nullifierJson = await (window as any).mina?.createNullifier({
      message: [], // or ["1", "2", "3"]
    });
    console.log('nullifierJson', nullifierJson);
    console.log('typeof nullifierJson', typeof nullifierJson);

    return nullifierJson;
  };

  const deployContract = async () => {
    // await (window as any).mina?.sendTransaction({
    // })
  };

  return (
    <div className={styles.container}>
      <Alert
        message={alert.message}
        visible={!!alert.message}
        onClose={() => {
          setAlert({ message: '', error: false });
        }}
        isError={alert.error}
      />
      <>
        <h1 className={styles.title}>Mina Ballot</h1>
        <p className={styles.description}>
          Cast your vote for the Mina Foundation Board of Directors
        </p>
      </>
      <Candidates
        onCastVote={(num) => {
          setCandidate(num);
        }}
      />
      <div className={styles.buttons}>
        {!state.hasBeenSetup && !state.voted && (
          <Button
            onClick={onConnect}
            text="Connect"
            loading={state.connecting}
            loadingText="Connecting..."
          />
        )}
        {!state.connecting &&
          state.hasBeenSetup &&
          state.hasWallet &&
          !state.voted && (
            <Button
              onClick={onCastVote}
              text="Vote"
              theme="primary"
              loading={state.voting}
              loadingText="Voting..."
              disabled={candidate < 0}
            />
          )}
        {state.voted && (
          <>
            <Button href="/results" theme="primary" text="Show results" />
            <Button
              href={transactionlink}
              theme="transparent"
              text="View transaction"
              openLinkInNewTab={true}
            />
          </>
        )}
      </div>
    </div>
  );
}
