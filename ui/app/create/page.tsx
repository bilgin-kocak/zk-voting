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

let transactionFee = 0.1;

export default function Create() {
  const [votingName, setVotingName] = useState('');
  const [votingDescription, setVotingDescription] = useState('');
  const [eligibleAddresses, setEligibleAddresses] = useState('');
  const [votingStartDate, setVotingStartDate] = useState('');
  const [votingEndDate, setVotingEndDate] = useState('');
  const [currentStep, setCurrentStep] = useState('');

  const handleCreateVoting = async () => {
    const eligibleAddressesArray = eligibleAddresses.split('\n');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/create`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // TODO: Deploy the contract

    const { Mina, PublicKey, UInt32 } = await import('o1js');
    const { Votes } = await import('@/contracts/build/src/');
    const ZkappWorkerClient = (await import('@/app/zkappWorkerClient')).default;
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    Mina.setActiveInstance(Berkeley);

    console.log('Loading web worker...');
    setCurrentStep('Loading web worker...');
    const zkappWorkerClient = new ZkappWorkerClient();
    await wait(5000);

    console.log('Done loading web worker');
    setCurrentStep('Done loading web worker');
    await zkappWorkerClient.setActiveInstanceToBerkeley();

    const mina = (window as any).mina;
    const publicKeyBase58: string = (await mina.requestAccounts())[0];
    console.log('publicKeyBase58', publicKeyBase58);

    const publicKey = PublicKey.fromBase58(publicKeyBase58);

    const res = await zkappWorkerClient.fetchAccount({
      publicKey: publicKey!,
    });

    await zkappWorkerClient.loadContract();
    console.log('Compiling zkApp...');
    setCurrentStep('Compiling zkApp...');

    await zkappWorkerClient.compileContract();
    console.log('zkApp compiled');
    setCurrentStep('zkApp compiled');

    const zkAppAddress: string =
      await zkappWorkerClient.createDeployTransaction(publicKeyBase58);

    console.log('Creating proof...');
    setCurrentStep('Creating proof for deploy transaction...');
    await zkappWorkerClient!.proveTransaction();

    console.log('Requesting send transaction...');
    setCurrentStep('Requesting send deploy transaction...');
    const transactionJSON = await zkappWorkerClient!.getTransactionJSON();
    console.log('transactionJSON', transactionJSON);

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

    console.log('zkAppAddress', zkAppAddress);

    // Convert start and end date to timestamp
    const startTimestamp = new Date(votingStartDate).getTime();
    const endTimestamp = new Date(votingEndDate).getTime();

    // Send the data to the server POST /vote/create'
    const data = await axios.post(
      url,
      {
        voteID: 1,
        voteName: votingName,
        voteDescription: votingDescription,
        eligibleVoterList: eligibleAddressesArray,
        zkAppAddress: zkAppAddress,
        offchainCID: '',
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
      },
      { headers }
    );

    console.log('data', data);

    // Initialize the contract
    await zkappWorkerClient.initZkappInstance(
      PublicKey.fromBase58(zkAppAddress)
    );
    setCurrentStep('Initializing zkApp instance...');

    let isInitialized = await zkappWorkerClient.getIsInitialized();
    console.log('isInitialized', isInitialized);
    if (isInitialized === 'true') {
      isInitialized = true;
    } else {
      isInitialized = false;
    }

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
    setCurrentStep('Contract Deployed and Initialized!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Create Voting</h1>
        <Container>
          <Flex gap="3" direction="column">
            <label htmlFor="voting-name">Voting name</label>
            <input
              id="voting-name"
              type="text"
              value={votingName}
              onChange={(e) => setVotingName(e.target.value)}
            />

            <label htmlFor="voting-description">Voting description</label>
            <textarea
              id="voting-description"
              value={votingDescription}
              onChange={(e) => setVotingDescription(e.target.value)}
            />

            <label htmlFor="eligible-addresses">
              Eligible addresses to vote
            </label>
            <TextArea
              placeholder="B62qjSfWdftx3W27jvzFFaxsK1oeyryWibUcP8TqSWYAi4Q5JJJXjp1"
              value={eligibleAddresses}
              onChange={(e) => setEligibleAddresses(e.target.value)}
            />
            <label>Voting Start Date</label>
            <TextField.Input
              type="date"
              onChange={(e) => setVotingStartDate(e.target.value)}
            />

            <label>Voting End Date</label>
            <TextField.Input
              type="date"
              onChange={(e) => setVotingEndDate(e.target.value)}
            />
          </Flex>
        </Container>
        <Button
          className={styles.button}
          onClick={handleCreateVoting}
          text={currentStep ? currentStep : 'Create Voting'}
        />

        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
