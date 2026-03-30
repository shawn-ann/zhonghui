const express = require('express');
const router = express.Router();
const AdminUserModel = require('../models/adminUser');
const md5 = require('md5');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    
    const user = await AdminUserModel.getByUsername(username);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // MD5 password check
    const hashedPassword = md5(password);
    if (user.password !== hashedPassword) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    console.log('Login successful');
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '当前密码和新密码不能为空' });
    }
    
    const user = await AdminUserModel.getByUsername('admin');
    
    // Verify current password
    const hashedCurrentPassword = md5(currentPassword);
    if (user.password !== hashedCurrentPassword) {
      return res.status(401).json({ error: '当前密码错误' });
    }
    
    // Update password
    const hashedNewPassword = md5(newPassword);
    await AdminUserModel.updatePassword('admin', hashedNewPassword);
    
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: '密码修改失败' });
  }
});

module.exports = router;