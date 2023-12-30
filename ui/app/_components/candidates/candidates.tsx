'use client';
import styles from './candidates.module.scss';
import cn from 'classnames';
import img1 from '@/public/yes.png';
import img2 from '@/public/no.png';
import { useState } from 'react';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks';
import numeral from 'numeral';

const OPTIONS = [
  {
    name: 'Yes',
    image: img1,
  },
  {
    name: 'No',
    image: img2,
  },
];

export default function Candidates({
  showResults = false,
  onCastVote,
}: {
  showResults?: boolean;
  onCastVote?: (number: number) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [electionResults, setElectionResults] = useLocalStorage(
    'electionResults',
    {
      candidates: Array(8).fill(0) as number[],
    }
  );

  const getTotalVotes = () => {
    return electionResults.candidates.reduce((a, b) => a + b, 0);
  };

  const getShare = (index: number) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) {
      return 0;
    }
    return (electionResults.candidates[index] / totalVotes) * 100;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {OPTIONS.map((option, index) => (
          <div
            className={cn(styles.option, {
              [styles.selected]: index === selectedIndex,
            })}
            key={index}
            onClick={() => {
              if (showResults) {
                return;
              }
              setSelectedIndex(index);
              onCastVote?.(index);
            }}
          >
            <div className={styles.option__image}>
              {showResults && getShare(index) > 0 && (
                <div
                  className={styles.option__vote__mask}
                  style={{
                    height: `${getShare(index)}%`,
                  }}
                >
                  <p className={styles.option__vote__value}>
                    {numeral(getShare(index)).format('0')}%
                  </p>
                </div>
              )}
              <Image
                src={option.image}
                alt={`Picture of ${option.name}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className={styles.option__name}>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
