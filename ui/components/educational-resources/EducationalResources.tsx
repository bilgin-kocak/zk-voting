import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import './EducationalResources.module.scss';

const EducationalResources: React.FC = () => {
  return (
    <div className="educationalResources">
      <h1>Educational Resources</h1>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="articles">
          <Accordion.Header>
            <Accordion.Trigger>
              Articles on Privacy and Blockchain Voting
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div>
              <h3>Understanding Blockchain Voting: A Privacy Perspective</h3>
              <p>
                Discuss how blockchain technology can ensure voter privacy and
                enhance the integrity of elections.
              </p>
              <a href="" target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
            <div>
              <h3>Case Study: Estonia&apos;s Digital Voting System</h3>
              <p>
                Explore how Estonia has implemented blockchain technology in its
                digital voting system and the impact on voter privacy.
              </p>
              <a href="" target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="tutorials">
          <Accordion.Header>
            <Accordion.Trigger>
              Tutorials on Using the Voting Application
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div>
              <h3>Getting Started with Blockchain-Based Voting</h3>
              <p>
                A beginner&apos;s guide on how to use a blockchain voting
                application.
              </p>
              <a href="" target="_blank" rel="noopener noreferrer">
                Start here
              </a>
            </div>
            <div>
              <h3>Frequently Asked Questions About Blockchain Voting</h3>
              <p>
                Answers to common questions about blockchain voting to help
                users understand the voting process.
              </p>
              <a href="" target="_blank" rel="noopener noreferrer">
                View FAQs
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="videos">
          <Accordion.Header>
            <Accordion.Trigger>
              Videos on Zero-Knowledge Proofs
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div>
              <h3>What are Zero-Knowledge Proofs?</h3>
              <p>
                An introductory video explaining the concept of zero-knowledge
                proofs and their importance.
              </p>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
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
                href="https://www.youtube.com/watch"
                target="_blank"
                rel="noopener noreferrer"
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
