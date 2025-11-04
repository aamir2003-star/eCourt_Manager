// ============================================================================
// SOLUTION 1: Fix User Model (backend/models/User.js)
// ============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'client'],
    required: true
  },
  f_name: {
    type: String,
    required: true
  },
  l_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number,
    required: true,
    unique: true
  },
  qualification: String,
  experience: String,
  address: String,
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: false,  // ✅ Changed from required: true
    default: null     // ✅ Added default null
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: false,  // ✅ Changed from required: true
    default: null     // ✅ Added default null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  photo: String,
  age: Number,
  dob: Date,
  date_of_reg: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


userSchema.pre('save', async function(next) {
  // IMPORTANT: Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);





