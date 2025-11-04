// models/CaseHearing.js
const mongoose = require('mongoose');
const caseHearingSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  hearing_date: {
    type: Date,
    required: true
  },
  remarks: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'postponed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('CaseHearing', caseHearingSchema);