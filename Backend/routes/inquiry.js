
// routes/inquiry.js
const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, authorize } = require('../middleware/auth');

// Create inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all inquiries
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort('-createdAt');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update inquiry status
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;