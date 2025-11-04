// models/Case.js
const mongoose = require('mongoose');
const caseSchema = new mongoose.Schema({
  case_title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fir_copy: String,
  police_station: String,
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  case_type: {
    type: String,
    required: true
  },
  case_reg_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'closed', 'on-hold'],
    default: 'pending'
  },
  result: {
    type: String,
    enum: ['pending', 'won', 'lost', 'settled'],
    default: 'pending'
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);