import Image from 'next/image';
import styles from './page.module.scss';
import Content from './list/index';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Content />
      </div>
    </div>
  );
}
