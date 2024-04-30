import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import axios from 'axios';
import styles from './CommunityForum.module.scss';
import {
  Container,
  TextArea,
  Box,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';

interface Post {
  _id: string;
  category: string;
  title: string;
  content: string;
  createdBy: string;
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
    // fetchPosts();
  }, []);

  const handlePostSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/forum', {
        title: newPostTitle,
        content: newPostContent,
        category: selectedCategory,
        createdBy: 'UserID',
      });
      setPosts([...posts, response.data]);
      setNewPostContent('');
      setNewPostTitle('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className={styles.communityForum}>
      <h1>Community Forum</h1>
      {/* <Accordion.Root type="single" collapsible className={styles.accordion}>
        {['general', 'policies', 'support'].map((category) => (
          <Accordion.Item key={category} value={category}>
            <Accordion.Header className={styles.header}>
              <Accordion.Trigger className={styles.trigger}>
                {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
                Discussions
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}> */}
      <Container>
        <Flex gap="3" direction="column">
          <label htmlFor="post-title">Post title</label>
          <input
            id="voting-name"
            type="text"
            placeholder="Title of your post"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />

          <label htmlFor="post-message">Post your messages</label>
          <textarea
            id="voting-description"
            value={newPostContent}
            placeholder="Type your message here..."
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            type="submit"
            className={styles.button}
            onClick={handlePostSubmit}
          >
            Submit
          </button>
        </Flex>
      </Container>
      {/* <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Title of your post"
          required
          className={styles.input}
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Type your message here..."
          required
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form> */}
      <ul className={styles.postsList}>
        {posts
          // .filter((post) => post.category === category)
          .map((post) => (
            <li key={post._id} className={styles.postItem}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>
                Posted by {post.createdBy} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </small>
            </li>
          ))}
      </ul>
      {/* </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root> */}
    </div>
  );
};

export default CommunityForum;
