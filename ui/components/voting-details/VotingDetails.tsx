import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import './VotingDetails.scss';

interface VotingOption {
  name: string;
  count: number;
}

interface VotingDetailsProps {
  title: string;
  description: string;
  criteria: string;
  options: VotingOption[];
  totalVotes: number;
  status: 'active' | 'completed';
  // Additional props as needed
}

const VotingDetails: React.FC<VotingDetailsProps> = ({
  title,
  description,
  criteria,
  options,
  totalVotes,
  status,
}) => {
  return (
    <div className="votingDetails">
      <h2>{title}</h2>
      <p>{description}</p>
      <div>Status: {status}</div>
      <h3>Results</h3>
      {options.map((option) => (
        <div key={option.name} className="option">
          <span>{option.name}</span>
          <Progress.Root
            value={option.count}
            max={totalVotes}
            className="progressBar"
          >
            <Progress.Indicator
              style={{ width: `${(option.count / totalVotes) * 100}%` }}
            />
          </Progress.Root>
          <span>{option.count} votes</span>
        </div>
      ))}
      <h3>Criteria</h3>
      <p>{criteria}</p>
      {/* FAQ Section */}
      <h3>FAQs</h3>
      <p>
        Here you can add commonly asked questions and answers about the voting
        process.
      </p>
    </div>
  );
};

export default VotingDetails;
