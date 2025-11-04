// models/Notification.js - NEW
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  type: {
    type: String,
    enum: [
      'case_request',
      'case_approved',
      'case_rejected',
      'case_assigned',
      'case_updated',
      'document_uploaded',
      'hearing_scheduled',
      'hearing_updated',
      'appointment_booked',
      'appointment_confirmed',
      'feedback_received',
      'system'
    ],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  // Related entities
  relatedCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  
  relatedDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  relatedHearing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hearing'
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: Date,
  
  // Action link
  actionUrl: String,
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
