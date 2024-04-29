import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import axios from 'axios';
import './CommunityForum.module.scss';

interface Post {
  _id: string;
  category: string;
  title: string;
  content: string;
  createdBy: string; // Simplified, depending on your user model
  createdAt: string;
}

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await axios.get('/api/forum');
      setPosts(result.data);
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/forum', {
        title: newPostTitle,
        content: newPostContent,
        category: selectedCategory,
        createdBy: 'UserID', // This should be replaced with actual user ID from session or JWT
      });
      setPosts([...posts, response.data]);
      setNewPostContent('');
      setNewPostTitle('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="communityForum">
      <h1>Community Forum</h1>
      <Accordion.Root type="single" collapsible>
        {['general', 'policies', 'support'].map((category) => (
          <Accordion.Item key={category} value={category}>
            <Accordion.Header>
              <Accordion.Trigger>
                {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
                Discussions
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <form onSubmit={handlePostSubmit}>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Title of your post"
                  required
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Type your message here..."
                  required
                />
                <button type="submit">Submit</button>
              </form>
              <ul>
                {posts
                  .filter((post) => post.category === category)
                  .map((post) => (
                    <li key={post._id}>
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                      <small>
                        Posted by {post.createdBy} on{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </li>
                  ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};

export default CommunityForum;
