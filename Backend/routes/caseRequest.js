const express = require('express');
const router = express.Router();
const CaseRequest = require('../models/CaseRequest');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Client creates case request
router.post('/', protect, authorize('client'), upload.array('documents', 5), async (req, res) => {
  try {
    const documents = req.files ? req.files.map(file => file.path) : [];
    
    const caseRequest = await CaseRequest.create({
      ...req.body,
      client: req.user.id,
      documents
    });

    res.status(201).json({
      success: true,
      data: caseRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get case requests (client sees their own, admin sees all)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.client = req.user.id;
    }

    const requests = await CaseRequest.find(query)
      .populate('client', 'f_name l_name email')
      .populate('preferred_lawyer', 'f_name l_name')
      .sort('-created_at');

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject case request (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await CaseRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;