import React, { useState, useEffect } from 'react';
import { VotingItem, Notification, UserProfile } from './interfaces';
import './UserDashboard.module.scss';

const UserDashboard: React.FC = () => {
  const [activeVotings, setActiveVotings] = useState<VotingItem[]>([]);
  const [votingHistory, setVotingHistory] = useState<VotingItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Mock fetch functions - replace with actual data fetching logic
  useEffect(() => {
    // TODO: Fetch active votings from the server
    setActiveVotings([]);
    setVotingHistory([]);
    setNotifications([]);
    setUserProfile({
      name: 'Bilgin Kocak',
      email: 'kocak@gmail.com',
      zkCredentials: 'EncryptedDataHere',
    });
  }, []);

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="userDashboard">
      <h2>Dashboard</h2>

      {/* Active Votings */}
      <div className="section">
        <h3>Active Votings</h3>
        {/* Mapping over active votings */}
        {activeVotings.length === 0 && <p>No active votings found.</p>}

        {activeVotings.map((voting) => (
          <div key={voting.id}>
            <h4>{voting.title}</h4>
            <p>{voting.description}</p>
            <p>Status: {voting.status}</p>
          </div>
        ))}
      </div>

      {/* Voting History */}
      <div className="section">
        <h3>Voting History</h3>
        {/* Mapping over voting history */}

        {/* If there are no voting history */}
        {votingHistory.length === 0 && <p>No voting history found.</p>}

        {/* If there are voting history show them */}
        {votingHistory.map((voting) => (
          <div key={voting.id}>
            <h4>{voting.title}</h4>
            <p>{voting.description}</p>
            <p>Status: {voting.status}</p>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="section">
        <h3>Notifications</h3>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            {notification.message}
            {!notification.read && <span> (New)</span>}
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="section">
        <h3>Profile</h3>
        {userProfile && (
          <div>
            <p>Name: {userProfile.name}</p>
            <p>Email: {userProfile.email}</p>
            {/* Additional profile details */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
