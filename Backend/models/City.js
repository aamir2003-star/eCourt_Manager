// models/City.js
const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
  city_name: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);