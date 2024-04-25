import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import './CommunityForum.module.scss';

const CommunityForum: React.FC = () => {
  const [generalDiscussionInput, setGeneralDiscussionInput] = useState('');

  const handleGeneralDiscussionSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      // Backend API call to post the message
      const response = await fetch('/api/forum/general-discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: generalDiscussionInput }),
      });
      if (response.ok) {
        alert('Message posted successfully!');
        setGeneralDiscussionInput('');
      } else {
        alert('Failed to post message.');
      }
    } catch (error) {
      console.error('Failed to submit message:', error);
      alert('An error occurred while posting the message.');
    }
  };

  return (
    <div className="communityForum">
      <h1>Community Forum</h1>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="discussions">
          <Accordion.Header>
            <Accordion.Trigger>
              Discussions on Voting Policies
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              Topics about recent voting policies, their implications, and
              community opinions.
            </p>
            {/* Optionally add form and input management like below */}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="general">
          <Accordion.Header>
            <Accordion.Trigger>General Community Discussions</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <form onSubmit={handleGeneralDiscussionSubmit}>
              <textarea
                value={generalDiscussionInput}
                onChange={(e) => setGeneralDiscussionInput(e.target.value)}
                placeholder="Type your message here..."
                className="messageInput"
              />
              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="support">
          <Accordion.Header>
            <Accordion.Trigger>Support and Feedback</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              Have questions or need help? Post here to get support and provide
              feedback on the platform.
            </p>
            {/* Additional form and input for support queries could be added similarly */}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default CommunityForum;
