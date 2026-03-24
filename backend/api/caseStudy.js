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

// Get all case studies with pagination and search
router.get('/', async (req, res) => {
  try {
    console.log('Request query:', req.query);
    const { page, pageSize, keyword } = req.query;
    
    let rows;
    let totalCount = 0;
    
    // 构建查询条件
    let whereClause = '';
    let queryParams = [];
    
    if (keyword && keyword.trim() !== '') {
      whereClause = 'WHERE title LIKE ?';
      queryParams.push(`%${keyword}%`);
    }
    
    // 获取总记录数
    const countQuery = `SELECT COUNT(*) as total FROM case_studies ${whereClause}`;
    const [countResult] = await pool.query(countQuery, queryParams);
    totalCount = countResult[0].total;
    
    if (page && pageSize) {
      const pageNum = parseInt(page) || 1;
      const sizeNum = parseInt(pageSize) || 10;
      const offset = (pageNum - 1) * sizeNum;
      // 使用 query 而不是 execute，因为 execute 对 LIMIT/OFFSET 参数支持有问题
      const dataQuery = `SELECT * FROM case_studies ${whereClause} ORDER BY publish_date DESC LIMIT ? OFFSET ?`;
      [rows] = await pool.query(dataQuery, [...queryParams, sizeNum, offset]);
    } else {
      const dataQuery = `SELECT * FROM case_studies ${whereClause} ORDER BY publish_date DESC`;
      [rows] = await pool.query(dataQuery, queryParams);
    }
    
    console.log('Query result:', rows.length, 'rows, total:', totalCount);
    
    res.json({ 
      data: rows, 
      total: totalCount 
    });
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
    // 直接保存 JSON 格式，不转换
    const id = await CaseStudyModel.create(title, content, imageUrl, publishDate);
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
    const { title, content, image_url: imageUrl } = req.body;
    // 直接保存 JSON 格式，不转换
    await CaseStudyModel.update(id, title, content, imageUrl);
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