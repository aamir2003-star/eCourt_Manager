// routes/notification.js - CORRECTED VERSION
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  clearAllNotifications
} = require('../controllers/notificationController');

// ✅ IMPORTANT: Generic routes MUST come AFTER specific routes

// Get unread count (SPECIFIC - must be BEFORE :notificationId)
router.get('/unread-count', protect, getUnreadCount);

// Clear all notifications (SPECIFIC - must be BEFORE :notificationId)
router.delete('/clear-all', protect, clearAllNotifications);

// Get all notifications for logged-in user (GENERIC)
router.get('/', protect, getNotifications);

// Mark all notifications as read (SPECIFIC - must be BEFORE :notificationId)
router.put('/mark-all-read', protect, markAllAsRead);

// Mark notification as read (SPECIFIC)
router.put('/:notificationId/read', protect, markAsRead);

// Delete notification (GENERIC with ID)
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;
