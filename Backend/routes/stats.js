// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/admin').get(protect, authorize('admin'), getAdminStats);

module.exports = router;