import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './page.module.scss';
import cn from 'classnames';

export default function ListVoting() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>List Voting</h1>
        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
