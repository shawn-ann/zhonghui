const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const CaseStudyModel = require('../models/caseStudy');
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

// Get all case studies with pagination
router.get('/', async (req, res) => {
  try {
    console.log('Request query:', req.query);
    const { page, pageSize } = req.query;
    
    let rows;
    if (page && pageSize) {
      const pageNum = parseInt(page) || 1;
      const sizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * sizeNum;
      // 使用 query 而不是 execute，因为 execute 对 LIMIT/OFFSET 参数支持有问题
      [rows] = await pool.query(
        'SELECT * FROM case_studies ORDER BY publish_date DESC LIMIT ? OFFSET ?',
        [sizeNum, offset]
      );
    } else {
      [rows] = await pool.query('SELECT * FROM case_studies ORDER BY publish_date DESC');
    }
    
    console.log('Query result:', rows.length, 'rows');
    
    res.json(rows);
  } catch (error) {
    console.error('Error getting case studies:', error);
    res.status(500).json({ error: 'Failed to get case studies', details: error.message });
  }
});

// Get a single case study by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await CaseStudyModel.getById(id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    // Increment view count
    await CaseStudyModel.incrementViewCount(id);
    res.json(caseStudy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case study' });
  }
});

// Create a new case study
router.post('/', async (req, res) => {
  try {
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    // 将 Quill Delta 转换为 HTML
    const htmlContent = convertDeltaToHtml(content);
    const id = await CaseStudyModel.create(title, htmlContent, imageUrl, publishDate);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating case study:', error);
    res.status(500).json({ error: 'Failed to create case study' });
  }
});

// Update a case study
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    // 将 Quill Delta 转换为 HTML
    const htmlContent = convertDeltaToHtml(content);
    await CaseStudyModel.update(id, title, htmlContent, imageUrl, publishDate);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({ error: 'Failed to update case study' });
  }
});

// Delete a case study
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CaseStudyModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete case study' });
  }
});

module.exports = router;