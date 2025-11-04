const mongoose = require('mongoose');

const caseRequestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  case_title: {
    type: String,
    required: true
  },
  case_type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  preferred_lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [String],
  admin_notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CaseRequest', caseRequestSchema);