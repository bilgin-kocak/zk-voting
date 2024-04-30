import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import styles from './EducationalResources.module.scss';

const EducationalResources: React.FC = () => {
  return (
    <div className={styles.educationalResources}>
      <h1>Educational Resources</h1>
      <Accordion.Root type="single" collapsible className={styles.accordion}>
        <Accordion.Item value="articles">
          <Accordion.Header className={styles.headers}>
            <Accordion.Trigger className={styles.trigger}>
              Articles on Privacy and Blockchain Voting
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            <div>
              <h3>Understanding Blockchain Voting: A Privacy Perspective</h3>
              <p>
                Discuss how blockchain technology can ensure voter privacy and
                enhance the integrity of elections.
              </p>
              <a
                href="https://ieeexplore.ieee.org/document/9751618"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backlink}
              >
                Read more
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="tutorials">
          <Accordion.Header className={styles.headers}>
            <Accordion.Trigger className={styles.trigger}>
              Tutorials on Using the Voting Application
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            <div>
              <h3>Getting Started with Blockchain-Based Voting</h3>
              <p>
                A beginner&apos;s guide on how to use a blockchain voting
                application.
              </p>
              <a
                href="https://www.hindawi.com/journals/mpe/2024/5591147/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backlink}
              >
                Start here
              </a>
            </div>
            <div>
              <h3>Frequently Asked Questions About Blockchain Voting</h3>
              <p>
                Answers to common questions about blockchain voting to help
                users understand the voting process.
              </p>
              <a
                href="https://epthinktank.eu/2019/07/17/3-key-questions-on-blockchain-voting/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backlink}
              >
                View FAQs
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="videos">
          <Accordion.Header className={styles.headers}>
            <Accordion.Trigger className={styles.trigger}>
              Videos on Zero-Knowledge Proofs
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            <div>
              <h3>What are Zero-Knowledge Proofs?</h3>
              <p>
                An introductory video explaining the concept of zero-knowledge
                proofs and their importance.
              </p>
              <a
                href="https://www.youtube.com/watch?v=GvwYJDzzI-g"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backlink}
              >
                Watch video
              </a>
            </div>
            <div>
              <h3>
                Deep Dive into Zero-Knowledge Proofs and Their Applications
              </h3>
              <p>
                A detailed look at the mathematical underpinnings of
                zero-knowledge proofs.
              </p>
              <a
                href="https://www.youtube.com/watch?v=uchjTIlPzFo&list=PLS01nW3Rtgor_yJmQsGBZAg5XM4TSGpPs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backlink}
              >
                Explore more
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default EducationalResources;
