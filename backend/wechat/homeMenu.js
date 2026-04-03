const express = require('express');
const router = express.Router();
const HomeMenuModel = require('../models/homeMenu');
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

// 小程序专用：获取菜单详情（返回HTML内容）
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await HomeMenuModel.getById(id);
    
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    // 将 Delta JSON 转换为 HTML
    const menuWithHtml = {
      ...menu,
      content: convertDeltaToHtml(menu.content || '')
    };
    
    res.json(menuWithHtml);
  } catch (error) {
    console.error('Error getting menu for wechat:', error);
    res.status(500).json({ error: 'Failed to get menu' });
  }
});

module.exports = router;