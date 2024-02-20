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

export default function Create() {
  const [votingName, setVotingName] = useState('');
  const [votingDescription, setVotingDescription] = useState('');
  const [eligibleAddresses, setEligibleAddresses] = useState('');

  useEffect(() => {
    // const votingName = document.getElementById('voting-name') as HTMLInputElement;
    // const votingDescription = document.getElementById(
    //   'voting-description'
    // ) as HTMLTextAreaElement;
    // const eligibleAddresses = document.getElementById(
    //   'eligible-addresses'
    // ) as HTMLTextAreaElement;
    // votingName.addEventListener('input', () => {
    //   setVotingName(votingName.value);
    // });
    // votingDescription.addEventListener('input', () => {
    //   setVotingDescription(votingDescription.value);
    // });
    // eligibleAddresses.addEventListener('input', () => {
    //   setEligibleAddresses(eligibleAddresses.value);
    // });
  }, []);

  const handleCreateVoting = async () => {
    const eligibleAddressesArray = eligibleAddresses.split('\n');

    const url = `${process.env.NEXT_BACKEND_URL}/vote/create`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // Send the data to the server POST /vote/create'
    const data = await axios.post(
      'http://localhost:3001/vote/create',
      {
        voteID: 1,
        voteName: votingName,
        voteDescription: votingDescription,
        eligibleVoterList: eligibleAddressesArray,
      },
      { headers }
    );

    console.log('data', data);

    // TODO: Deploy the contract
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
          </Flex>
        </Container>
        <Button
          className={styles.button}
          onClick={handleCreateVoting}
          text="Vote"
        />

        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
