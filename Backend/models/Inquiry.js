// models/Inquiry.js
const mongoose = require('mongoose');
const inquirySchema = new mongoose.Schema({
  inquiry_name: {
    type: String,
    required: true
  },
  email_id: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);