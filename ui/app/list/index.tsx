'use client';
import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './index.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { VotingCard } from '@/components/voting-card/VotingCard';

export default function ListVoting() {
  const [votings, setVotings] = useState<any[]>([]);
  useEffect(() => {
    // Get votings from the server
    const getVotings = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/votes`;
      console.log('url', url);
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await axios.get(url, { headers });
      console.log('votes', data);
      setVotings(data.data);
    };
    getVotings();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>List Voting</h1>
        <ul>
          {votings.map((voting) => (
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
            // <li key={voting._id}>
            //   <a href={`/vote/${voting.voteID}`}>{voting.voteName}</a>
            // </li>
          ))}
        </ul>
        <Button className={styles.button} href="/create" text="Create Voting" />
        <Button
          className={styles.button}
          href="/related-voting"
          text="Your Voting"
        />
        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
