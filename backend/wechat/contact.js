// contact.js
const express = require('express');
const ContactSubmissions = require('../models/contactSubmission');
const router = express.Router();

// 提交联系表单
router.post('/contact', async (req, res) => {
  try {
    const contactData = req.body;
    
    // 验证数据
    if (!contactData.name || !contactData.birthday || !contactData.projects || !contactData.education || !contactData.conditions || !contactData.englishLevel || !contactData.childcareExp || !contactData.city || !contactData.contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 创建联系表单
    const newContact = await ContactSubmissions.create(contactData);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
  }
});

module.exports = router;
