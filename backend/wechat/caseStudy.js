const express = require('express');
const router = express.Router();
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

// 小程序专用：获取案例分享列表（返回HTML内容）
router.get('/', async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    
    let rows;
    if (page && pageSize) {
      rows = await CaseStudyModel.getPaginated(page, pageSize);
    } else {
      rows = await CaseStudyModel.getAll();
    }
    
    // 将 Delta JSON 转换为 HTML
    const rowsWithHtml = rows.map(item => ({
      ...item,
      content: convertDeltaToHtml(item.content)
    }));
    
    // 小程序端直接返回HTML内容
    res.json(rowsWithHtml);
  } catch (error) {
    console.error('Error getting case studies for wechat:', error);
    res.status(500).json({ error: 'Failed to get case studies', details: error.message });
  }
});

// 小程序专用：获取单个案例详情（返回HTML内容）
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await CaseStudyModel.getById(id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    // 增加浏览次数
    await CaseStudyModel.incrementViewCount(id);
    // 将 Delta JSON 转换为 HTML
    const caseStudyWithHtml = {
      ...caseStudy,
      content: convertDeltaToHtml(caseStudy.content)
    };
    // 小程序端直接返回HTML内容
    res.json(caseStudyWithHtml);
  } catch (error) {
    console.error('Error getting case study for wechat:', error);
    res.status(500).json({ error: 'Failed to get case study' });
  }
});

module.exports = router;
