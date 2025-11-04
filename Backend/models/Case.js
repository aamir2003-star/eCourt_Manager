// models/Case.js - CORRECTED WITH ACCEPTANCE FIELDS
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['pending', 'active', 'closed', 'on-hold'],
    default: 'pending'
  },
  
  // 🔐 Access Control Fields
  classification: {
    type: String,
    enum: ['public', 'confidential', 'classified'],
    default: 'public'
  },
  
  // Staff members assigned to this case
  assigned_staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Case owner/creator
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Primary lawyer/staff handling the case
  primary_lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  case_reg_date: {
    type: Date,
    default: Date.now
  },
  
  police_station: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  
  result: {
    type: String,
    enum: ['pending', 'won', 'lost', 'settled'],
    default: 'pending'
  },
  
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  hearings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hearing'
  }],
  
  // ✅ NEW: Acceptance tracking fields
  accepted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  accepted_at: {
    type: Date,
    default: null
  },
  
  // Audit trail
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
caseSchema.index({ client: 1, status: 1 });
caseSchema.index({ assigned_staff: 1 });
caseSchema.index({ classification: 1 });
caseSchema.index({ accepted_by: 1 }); // ✅ NEW: Index for accepted cases

module.exports = mongoose.model('Case', caseSchema);
