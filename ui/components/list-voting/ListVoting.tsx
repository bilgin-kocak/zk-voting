import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './ListVoting.module.scss';

// Define a type for individual voting items
type VotingItem = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  votesCount: number;
  status: string; // Consider making this a union type if you have specific status values (e.g., 'active' | 'pending' | 'closed')
};

// Define a type for the component props
type ListVotingsProps = {
  votings: VotingItem[];
};

const ListVotings: React.FC<ListVotingsProps> = ({ votings }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredVotings = votings.filter((voting) =>
    voting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="votingContainer">
      <input
        type="text"
        placeholder="Search votings..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar"
      />
      <div className="votingGrid">
        {filteredVotings.map((voting) => (
          <div key={voting.id} className="votingCard">
            <h2>{voting.title}</h2>
            <p>{voting.description}</p>
            <p>
              <strong>Start:</strong> {voting.startDate} <strong>End:</strong>{' '}
              {voting.endDate}
            </p>
            <p>
              <strong>Votes:</strong> {voting.votesCount}
            </p>
            <p>Status: {voting.status}</p>
            <button className="detailsButton">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListVotings;
