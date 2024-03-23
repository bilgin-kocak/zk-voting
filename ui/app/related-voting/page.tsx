'use client';
import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './page.module.scss';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import {
  Container,
  TextArea,
  Box,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import axios from 'axios';
import type ZkappWorkerClient from '../zkappWorkerClient';
import { wait } from '@/lib/client-side/utils';
import { VotingCard } from '@/components/voting-card/VotingCard';

export default function RelatedVotings() {
  const [alert, setAlert] = useState({ message: '', error: false });
  const [relatedVotings, setRelatedVotings] = useState<any[]>([]);

  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    publicKey: null as null | any,
    connecting: false,
  });

  useEffect(() => {
    const getRelatedVotings = async () => {
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/votes/${state.publicKey.toBase58()}`;
      console.log('url', url);
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await axios.get(url, { headers });
      console.log('votes', data);
      setRelatedVotings(data.data);
    };
    if (state.publicKey) {
      getRelatedVotings();
    }
  }, [state.publicKey]);

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

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
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
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Votings</h1>
        <p>Votings that you are eligible to vote.</p>

        {state.hasBeenSetup && (
          <div>
            <h2>Connected</h2>
            <ul>
              {relatedVotings.map((voting) => (
                <VotingCard
                  key={voting._id}
                  voteName={voting.voteName}
                  voteDescription={voting.voteDescription}
                  zkAppAddress={
                    voting.zkAppAddress ? voting.zkAppAddress : 'not-found'
                  }
                />
                // <li key={voting._id}>
                //   <a href={`/vote/${voting.voteID}`}>{voting.voteName}</a>
                // </li>
              ))}
            </ul>
          </div>
        )}

        {!state.hasBeenSetup && (
          <Button
            onClick={onConnect}
            text="Connect"
            loading={state.connecting}
            loadingText="Connecting..."
          />
        )}

        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
