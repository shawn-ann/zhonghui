const express = require('express');
const router = express.Router();
const QAArticleModel = require('../models/qaArticle');

// Get all QA articles
router.get('/', async (req, res) => {
  try {
    const articles = await QAArticleModel.getAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QA articles' });
  }
});

// Get a single QA article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await QAArticleModel.getById(id);
    if (!article) {
      return res.status(404).json({ error: 'QA article not found' });
    }
    // Increment view count
    await QAArticleModel.incrementViewCount(id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QA article' });
  }
});

// Create a new QA article
router.post('/', async (req, res) => {
  try {
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    const id = await QAArticleModel.create(title, content, imageUrl, publishDate);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating QA article:', error);
    res.status(500).json({ error: 'Failed to create QA article' });
  }
});

// Update a QA article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    await QAArticleModel.update(id, title, content, imageUrl, publishDate);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating QA article:', error);
    res.status(500).json({ error: 'Failed to update QA article' });
  }
});

// Delete a QA article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await QAArticleModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete QA article' });
  }
});

module.exports = router;