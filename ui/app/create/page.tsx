import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './page.module.scss';
import cn from 'classnames';

export default function Create() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Create Voting</h1>

        <div className={styles.form}>
          <label htmlFor="voting-name">Voting name</label>
          <input id="voting-name" type="text" />

          <label htmlFor="voting-description">Voting description</label>
          <textarea id="voting-description" />

          <label htmlFor="eligible-addresses">Eligible addresses to vote</label>
          <textarea id="eligible-addresses" />
        </div>

        <Button className={styles.button} href="/" text="Go back" />
      </div>
    </div>
  );
}
