// routes/case.js
const express = require('express');
const router = express.Router();
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  uploadDocument,
  scheduleHearing
} = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getCases)
  .post(protect, authorize('admin', 'staff'), upload.single('fir_copy'), createCase);

router.route('/:id')
  .get(protect, getCaseById)
  .put(protect, authorize('admin', 'staff'), updateCase)
  .delete(protect, authorize('admin', 'staff'), deleteCase);

router.post('/:caseId/documents', protect, authorize('admin', 'staff'), upload.single('file'), uploadDocument);
router.post('/:caseId/hearings', protect, authorize('admin', 'staff'), scheduleHearing);

module.exports = router;