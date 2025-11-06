// routes/case.js - CORRECTED & FIXED
const express = require('express');
const router = express.Router();
const {
  createCase,
  getCases,
  getCase,
  updateCase,
  deleteCase,
  uploadDocument,
  scheduleHearing,
  assignStaff,
  getMyHearings
} = require('../controllers/caseController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ✅ Get all cases (with role-based filtering)
router.get('/', protect, getCases);

router.get('/hearings/my', protect, authorize('staff', 'client'), getMyHearings);

// ✅ Create case (admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('fir_copy'),
  createCase
);

// ✅ Get single case (with access control) - MUST BE AFTER specific routes
router.get('/:id', protect, getCase);

// ✅ Assign staff to case (admin only)
router.post(
  '/:id/assign-staff',
  protect,
  authorize('admin'),
  assignStaff
);

// ✅ Upload document to case
router.post(
  '/:caseId/documents',
  protect,
  upload.single('file'),
  uploadDocument
);

// ✅ Schedule hearing for case
router.post(
  '/:caseId/hearings',
  protect,
  authorize('admin', 'staff'),
  scheduleHearing
);

// ✅ Update case (admin only)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateCase
);

// ✅ Delete case (admin only)
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteCase
);
// routes/case.js - ADD THIS NEW ROUTE

// Accept case (staff/lawyer)
router.put('/:id/accept', protect, authorize('staff'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find case
    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check if user is assigned to this case
    const isAssigned = caseData.assigned_staff && caseData.assigned_staff.some(
      staffId => staffId.toString() === userId.toString()
    );

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this case'
      });
    }

    // Update case status
    caseData.status = 'active';
    caseData.accepted_by = userId;
    caseData.accepted_at = new Date();
    await caseData.save();

    // Notify client
    try {
      await Notification.create({
        recipient: caseData.client,
        sender: userId,
        type: 'case_updated',
        title: 'Case Accepted',
        message: `Your case "${caseData.case_title}" has been accepted by ${req.user.f_name} ${req.user.l_name}`,
        relatedCase: caseData._id,
        actionUrl: `/client/cases/${caseData._id}`,
        priority: 'high'
      });

      // Emit Socket.io event
      if (io) {
        io.to(`user_${caseData.client}`).emit('case_accepted', {
          caseId: caseData._id,
          case_title: caseData.case_title,
          acceptedBy: `${req.user.f_name} ${req.user.l_name}`,
          message: 'Your case has been accepted'
        });
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.json({
      success: true,
      message: 'Case accepted successfully',
      data: caseData
    });
  } catch (error) {
    console.error('Accept case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept case',
      error: error.message
    });
  }
});


module.exports = router;
