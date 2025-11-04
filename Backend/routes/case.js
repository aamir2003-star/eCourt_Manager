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
  assignStaff
} = require('../controllers/caseController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ✅ Get all cases (with role-based filtering)
router.get('/', protect, getCases);

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

module.exports = router;
