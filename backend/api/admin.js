const express = require('express');
const router = express.Router();
const AdminUserModel = require('../models/adminUser');

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
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
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

module.exports = router;