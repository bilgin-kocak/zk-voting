export interface VotingItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed'; // Add more statuses as needed
}

export interface Notification {
  id: string;
  message: string;
  link: string;
  read: boolean; // Track if the notification has been read
}

export interface UserProfile {
  name: string;
  email: string;
  zkCredentials: string; // Simplified for this example
}
