
// models/CaseDocument.js
const mongoose = require('mongoose');
const caseDocumentSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  case_title: String,
  description: String,
  file: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CaseDocument', caseDocumentSchema);