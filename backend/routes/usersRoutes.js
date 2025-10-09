const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET: Count all users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, totalUsers: count });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: List all users (optional)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
