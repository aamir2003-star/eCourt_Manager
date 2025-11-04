const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-created_at')
      .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });

    res.json({ 
      success: true, 
      data: notifications,
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

