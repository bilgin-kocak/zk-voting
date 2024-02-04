import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './page.module.scss';
import cn from 'classnames';

export default function ListVoting() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>You can create an secret voting</h1>
        <Button className={styles.button} href="/create" text="Create Voting" />
        <h1>Or see all the voting</h1>
        <Button className={styles.button} href="/list" text="See All Voting" />
      </div>
    </div>
  );
}
