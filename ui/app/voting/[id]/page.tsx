'use client';
import { Button } from '@/components/button/Button';
import Candidates from '../../_components/candidates/candidates';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';

export default function Voting({ params }: { params: { id: string } }) {
  const [voting, setVoting] = useState<any>({});
  useEffect(() => {
    // Get the voting from the server
    const getVoting = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/${params.id}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      try {
        const data = await axios.get(
          `http://localhost:3001/vote/${params.id}`,
          {
            headers,
          }
        );
        console.log('vote', data);
        setVoting(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getVoting();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {voting && voting.voteName ? (
          <>
            <h1>Welcome to the voting {params.id}</h1>
            <h1>{voting.voteName}</h1>
          </>
        ) : (
          <h1>No voting found wtih given id</h1>
        )}
      </div>
    </div>
  );
}
