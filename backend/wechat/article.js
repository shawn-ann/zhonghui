const express = require('express');
const router = express.Router();
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

// 小程序专用：获取文章列表（返回HTML内容）
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, articleType } = req.query;
    
    let result;
    if (page && pageSize) {
      result = await ArticleModel.getPaginated(page, pageSize, articleType);
    } else {
      result = await ArticleModel.getAll(articleType);
    }
    
    // 处理返回数据格式
    const rows = Array.isArray(result) ? result : result.data || [];
    
    // 将 Delta JSON 转换为 HTML
    const rowsWithHtml = rows.map(item => ({
      ...item,
      content: convertDeltaToHtml(item.content)
    }));
    
    // 小程序端直接返回HTML内容
    res.json(rowsWithHtml);
  } catch (error) {
    console.error('Error getting articles for wechat:', error);
    res.status(500).json({ error: 'Failed to get articles', details: error.message });
  }
});

// 小程序专用：获取单个文章详情（返回HTML内容）
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.getById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // 增加浏览次数
    await ArticleModel.incrementViewCount(id);
    // 将 Delta JSON 转换为 HTML
    const articleWithHtml = {
      ...article,
      content: convertDeltaToHtml(article.content)
    };
    // 小程序端直接返回HTML内容
    res.json(articleWithHtml);
  } catch (error) {
    console.error('Error getting article for wechat:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});

module.exports = router;
