const express = require('express');
const router = express.Router();
const CarouselModel = require('../models/carousel');

// Get all carousel images
router.get('/', async (req, res) => {
  try {
    const images = await CarouselModel.getAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get carousel images' });
  }
});

// Create a new carousel image
router.post('/', async (req, res) => {
  try {
    const { image_url: imageUrl, title, order_num: orderNum, content } = req.body;
    const id = await CarouselModel.create(imageUrl, title, orderNum, content);
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
    const { image_url: imageUrl, title, order_num: orderNum, content } = req.body;
    await CarouselModel.update(id, imageUrl, title, orderNum, content);
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