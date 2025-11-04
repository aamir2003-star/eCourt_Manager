// routes/caseRequest.js - CORRECTED (REVERT TO CORRECT)
const express = require('express');
const router = express.Router();
const CaseRequest = require('../models/CaseRequest');
const Case = require('../models/Case');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Client creates case request + Notify admins
router.post('/', protect, authorize('client'), upload.array('documents', 5), async (req, res) => {
  try {
    const documents = req.files ? req.files.map(file => file.path) : [];
    
    const caseRequest = await CaseRequest.create({
      ...req.body,
      client: req.user._id,
      documents
    });

    // Notify all admins
    try {
      const admins = await User.find({ role: 'admin' });
      
      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          recipient: admin._id,
          sender: req.user._id,
          title: 'New Case Request',
          message: `${req.user.f_name} ${req.user.l_name} submitted: "${req.body.case_title}"`,
          type: 'case_request',
          relatedCase: caseRequest._id,
          actionUrl: '/admin/case-requests',
          priority: 'high'
        }));

        await Notification.insertMany(notifications);
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(201).json({ success: true, data: caseRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get case requests
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.client = req.user._id;
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

// Approve/Reject + Create Case + Notify
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, admin_notes, assign_to_staff } = req.body;
    
    const request = await CaseRequest.findById(req.params.id).populate('client');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.admin_notes = admin_notes;
    await request.save();

    // If approved, create case with status = "pending"
    if (status === 'approved' && assign_to_staff) {
      const newCase = await Case.create({
        case_title: request.case_title,
        description: request.description,
        case_type: request.case_type,
        client: request.client._id,
        assigned_staff: [assign_to_staff],
        primary_lawyer: assign_to_staff,
        status: 'pending',  // ✅ Status is "pending" - lawyer needs to accept
        case_reg_date: new Date(),
        created_by: req.user._id
      });

      // ✅ Notify client that request was approved
      try {
        await Notification.create({
          recipient: request.client._id,
          sender: req.user._id,
          title: 'Case Approved ✅',
          message: `Your case "${request.case_title}" has been approved!`,
          type: 'case_approved',
          relatedCase: newCase._id,
          actionUrl: `/client/cases/${newCase._id}`,
          priority: 'high'
        });
      } catch (err) {
        console.error('Client notification error:', err);
      }

      // ✅ Notify assigned lawyer that they got a new case (pending acceptance)
      try {
        await Notification.create({
          recipient: assign_to_staff,
          sender: req.user._id,
          title: 'New Case Assigned 📋',
          message: `New case assigned: "${request.case_title}" - Please review and accept`,
          type: 'case_assigned',
          relatedCase: newCase._id,
          actionUrl: `/staff/cases/${newCase._id}`,
          priority: 'high'
        });
      } catch (err) {
        console.error('Lawyer notification error:', err);
      }
    } else if (status === 'rejected') {
      // Notify client of rejection
      try {
        await Notification.create({
          recipient: request.client._id,
          sender: req.user._id,
          title: 'Case Request Rejected ❌',
          message: `Your request "${request.case_title}" was rejected. ${admin_notes || ''}`,
          type: 'case_rejected',
          relatedCase: request._id,
          actionUrl: '/client/case-requests',
          priority: 'high'
        });
      } catch (err) {
        console.error('Rejection notification error:', err);
      }
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
