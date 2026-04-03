const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const HomeMenuModel = require('../models/homeMenu');

// Get all home menus
router.get('/', async (req, res) => {
  try {
    const menus = await HomeMenuModel.getAll();
    res.json(menus);
  } catch (error) {
    console.error('Error getting home menus:', error);
    res.status(500).json({ error: 'Failed to get home menus', details: error.message });
  }
});

// Get a single home menu by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await HomeMenuModel.getById(id);
    
    if (!menu) {
      return res.status(404).json({ error: 'Home menu not found' });
    }
    
    res.json(menu);
  } catch (error) {
    console.error('Error getting home menu:', error);
    res.status(500).json({ error: 'Failed to get home menu', details: error.message });
  }
});

// Create a new home menu
router.post('/', async (req, res) => {
  try {
    const { title, icon_url: iconUrl, content, order_num: orderNum } = req.body;
    const id = await HomeMenuModel.create(title, iconUrl, content, orderNum);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating home menu:', error);
    res.status(500).json({ error: 'Failed to create home menu' });
  }
});

// Update a home menu
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon_url: iconUrl, content, order_num: orderNum } = req.body;
    await HomeMenuModel.update(id, title, iconUrl, content, orderNum);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating home menu:', error);
    res.status(500).json({ error: 'Failed to update home menu' });
  }
});

// Delete a home menu
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HomeMenuModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete home menu' });
  }
});

module.exports = router;