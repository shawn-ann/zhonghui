// contactSubmission.js
const express = require('express');
const ContactSubmissions = require('../models/contactSubmission');
const router = express.Router();

// 获取联系表单列表（带分页）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const result = await ContactSubmissions.getPaginated(page, pageSize);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Failed to get contacts', details: error.message });
  }
});

// 根据ID获取联系表单
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactSubmissions.getById(id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error getting contact:', error);
    res.status(500).json({ error: 'Failed to get contact', details: error.message });
  }
});


module.exports = router;