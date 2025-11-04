// routes/caseRequest.js - CORRECTED
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
      client: req.user._id,  // ✅ Changed from req.user.id
      documents
    });

    // ✅ FIXED: Notify all admins with correct fields
    try {
      const admins = await User.find({ role: 'admin' });
      
      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          recipient: admin._id,  // ✅ Changed from 'user' to 'recipient'
          sender: req.user._id,  // ✅ Added sender
          title: 'New Case Request',
          message: `${req.user.f_name} ${req.user.l_name} submitted: "${req.body.case_title}"`,
          type: 'case_request',  // ✅ Changed from 'case' to valid enum 'case_request'
          relatedCase: caseRequest._id,  // ✅ Added relatedCase
          actionUrl: '/admin/case-requests',  // ✅ Changed from 'link' to 'actionUrl'
          priority: 'high'  // ✅ Added priority
        }));

        await Notification.insertMany(notifications);
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the case request creation if notification fails
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
      query.client = req.user._id;  // ✅ Changed from req.user.id
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

    // If approved, create case
    if (status === 'approved' && assign_to_staff) {
      const newCase = await Case.create({
        case_title: request.case_title,
        description: request.description,
        case_type: request.case_type,
        client: request.client._id,
        assigned_staff: [assign_to_staff],  // ✅ Changed from 'staff' to 'assigned_staff' (as array)
        primary_lawyer: assign_to_staff,  // ✅ Added primary_lawyer
        status: 'pending',
        case_reg_date: new Date()
      });

      // ✅ FIXED: Notify client with correct fields
      try {
        await Notification.create({
          recipient: request.client._id,  // ✅ Changed from 'user' to 'recipient'
          sender: req.user._id,  // ✅ Added sender
          title: 'Case Approved ✅',
          message: `Your case "${request.case_title}" has been approved and assigned.`,
          type: 'case_approved',  // ✅ Changed from 'case' to valid enum 'case_approved'
          relatedCase: newCase._id,  // ✅ Changed from 'link' to 'relatedCase'
          actionUrl: `/client/cases/${newCase._id}`,  // ✅ Changed from 'link' to 'actionUrl'
          priority: 'high'  // ✅ Added priority
        });

        // ✅ FIXED: Notify assigned lawyer with correct fields
        await Notification.create({
          recipient: assign_to_staff,  // ✅ Changed from 'user' to 'recipient'
          sender: req.user._id,  // ✅ Added sender
          title: 'New Case Assigned 📋',
          message: `New case assigned: "${request.case_title}"`,
          type: 'case_assigned',  // ✅ Changed from 'case' to valid enum 'case_assigned'
          relatedCase: newCase._id,  // ✅ Changed from 'link' to 'relatedCase'
          actionUrl: `/staff/cases/${newCase._id}`,  // ✅ Changed from 'link' to 'actionUrl'
          priority: 'high'  // ✅ Added priority
        });
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    } else if (status === 'rejected') {
      // ✅ FIXED: Notify client rejection with correct fields
      try {
        await Notification.create({
          recipient: request.client._id,  // ✅ Changed from 'user' to 'recipient'
          sender: req.user._id,  // ✅ Added sender
          title: 'Case Request Rejected ❌',
          message: `Your request "${request.case_title}" was rejected. ${admin_notes || ''}`,
          type: 'case_rejected',  // ✅ Changed from 'case' to valid enum 'case_rejected'
          relatedCase: request._id,  // ✅ Added relatedCase
          actionUrl: '/client/case-requests',  // ✅ Changed from 'link' to 'actionUrl'
          priority: 'high'  // ✅ Added priority
        });
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
