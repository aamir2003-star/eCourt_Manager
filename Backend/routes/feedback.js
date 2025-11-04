
// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

// Create feedback
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      client: req.user.id
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all feedback
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('client', 'f_name l_name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;