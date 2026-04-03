const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const CarouselModel = require('../models/carousel');

// Get a single carousel image by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM carousel_images WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carousel image not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting carousel image:', error);
    res.status(500).json({ error: 'Failed to get carousel image', details: error.message });
  }
});

// Get all carousel images with pagination
router.get('/', async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    
    let rows;
    let totalCount = 0;
    
    // 获取总记录数
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM carousel_images');
    totalCount = countResult[0].total;
    
    if (page && pageSize) {
      const pageNum = parseInt(page) || 1;
      const sizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * sizeNum;
      // 使用 query 而不是 execute，因为 execute 对 LIMIT/OFFSET 参数支持有问题
      [rows] = await pool.query(
        'SELECT * FROM carousel_images ORDER BY order_num ASC LIMIT ? OFFSET ?',
        [sizeNum, offset]
      );
    } else {
      [rows] = await pool.query('SELECT * FROM carousel_images ORDER BY order_num ASC');
    }
    
    res.json({ 
      data: rows, 
      total: totalCount 
    });
  } catch (error) {
    console.error('Error getting carousel images:', error);
    res.status(500).json({ error: 'Failed to get carousel images', details: error.message });
  }
});

// Create a new carousel image
router.post('/', async (req, res) => {
  try {
    const { image_url: imageUrl, title, article_url: articleUrl, order_num: orderNum } = req.body;
    const id = await CarouselModel.create(imageUrl, title, articleUrl, orderNum);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating carousel image:', error);
    res.status(500).json({ error: 'Failed to create carousel image' });
  }
});

// Update a carousel image
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url: imageUrl, title, article_url: articleUrl, order_num: orderNum } = req.body;
    await CarouselModel.update(id, imageUrl, title, articleUrl, orderNum);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating carousel image:', error);
    res.status(500).json({ error: 'Failed to update carousel image' });
  }
});

// Delete a carousel image
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CarouselModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete carousel image' });
  }
});

module.exports = router;