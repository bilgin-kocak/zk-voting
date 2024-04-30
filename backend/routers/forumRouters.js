const express = require('express');
const router = express.Router();
const ForumPost = require('../models/forumPostModel');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get posts by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await ForumPost.find({ category }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { category, title, content, createdBy } = req.body;
  const post = new ForumPost({
    category,
    title,
    content,
    createdBy,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to find post by ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await ForumPost.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

// Get a single post
router.get('/post/:id', getPost, (req, res) => {
  res.json(res.post);
});

// Update a post
router.patch('/post/:id', getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post
router.delete('/post/:id', getPost, async (req, res) => {
  try {
    await res.post.remove();
    res.json({ message: 'Deleted Post' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
