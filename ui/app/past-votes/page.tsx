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

export default function PastVotes() {
  const [alert, setAlert] = useState({ message: '', error: false });
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() => {
    const getPastVotes = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/past-votes`;
      console.log('url', url);
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await axios.get(url, { headers });
      console.log('votes', data);
      setVotes(data.data);
    };
    getPastVotes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Past Votes</h1>
        <p>You can see the past votes and their results.</p>
        {votes.length === 0 && <p>No past votes found.</p>}
        <div>
          <ul>
            {votes.map((voting) => (
              <VotingCard
                key={voting._id}
                voteName={voting.voteName}
                voteDescription={voting.voteDescription}
                zkAppAddress={
                  voting.zkAppAddress ? voting.zkAppAddress : 'not-found'
                }
                startTimestamp={voting.startTimestamp}
                endTimestamp={voting.endTimestamp}
              />
            ))}
          </ul>
        </div>

        <Button className={styles.button} href="/" text="Go Home" />
      </div>
    </div>
  );
}
