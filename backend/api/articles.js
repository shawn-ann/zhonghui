const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const ArticleModel = require('../models/article');
const { QuillDeltaToHtmlConverter } = require('quill-delta-to-html');

// 将 Quill Delta 转换为 HTML
function convertDeltaToHtml(deltaJson) {
  try {
    const delta = JSON.parse(deltaJson);
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    return converter.convert();
  } catch (error) {
    // 如果不是有效的 Delta JSON，则原样返回
    return deltaJson;
  }
}

// Get all articles with pagination and search
router.get('/', async (req, res) => {
  try {
    console.log('Request query:', req.query);
    const { page, pageSize, articleType, keyword } = req.query;
    
    if (page && pageSize) {
      const result = await ArticleModel.getPaginated(page, pageSize, articleType, keyword);
      res.json(result);
    } else {
      const articles = await ArticleModel.getAll(articleType);
      res.json({ data: articles, total: articles.length });
    }
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: 'Failed to get articles', details: error.message });
  }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.getById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Increment view count
    await ArticleModel.incrementViewCount(id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get article' });
  }
});

// Create a new article
router.post('/', async (req, res) => {
  try {
    const { title, content, image_url: imageUrl, article_type: articleType, publish_date: publishDate } = req.body;
    // 直接保存 JSON 格式，不转换
    const id = await ArticleModel.create(title, content, imageUrl, articleType, publishDate);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update an article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url: imageUrl } = req.body;
    // 直接保存 JSON 格式，不转换
    await ArticleModel.update(id, title, content, imageUrl);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete an article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ArticleModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;