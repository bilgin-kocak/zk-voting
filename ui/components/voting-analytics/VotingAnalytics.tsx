import React from 'react';
import { Line } from 'react-chartjs-2';
import * as Tabs from '@radix-ui/react-tabs';
import './VotingAnalytics.module.scss';

const VotingAnalytics: React.FC = () => {
  // Example data for voter turnout and voting numbers over time
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Voter Turnout 2024',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Total Votes Per Month',
        data: [120, 200, 150, 230, 180, 240],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="votingAnalytics">
      <h1>Voting Analytics</h1>
      <Tabs.Root defaultValue="turnout">
        <Tabs.List>
          <Tabs.Trigger value="turnout">Voter Turnout</Tabs.Trigger>
          <Tabs.Trigger value="votes">Votes Over Time</Tabs.Trigger>
          <Tabs.Trigger value="demographics">Demographic Insights</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="turnout">
          <Line data={data} />
        </Tabs.Content>
        <Tabs.Content value="votes">
          <Line data={data} />
        </Tabs.Content>
        <Tabs.Content value="demographics">
          <p>Demographic insights will be displayed here.</p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default VotingAnalytics;
