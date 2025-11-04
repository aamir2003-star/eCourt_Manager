
// ============================================================================
// SOLUTION 2: Fix Register Controller (backend/controllers/authController.js)
// ============================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpire } = require('../config/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpire });
};

exports.register = async (req, res) => {
  try {
    const { username, password, role, f_name, l_name, email, contact } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Clean up the data - remove empty strings for ObjectId fields
    const userData = {
      username,
      password,
      role,
      f_name,
      l_name,
      email,
      contact,
      qualification: req.body.qualification,
      experience: req.body.experience,
      address: req.body.address,
      gender: req.body.gender,
      age: req.body.age,
      dob: req.body.dob
    };

    // ✅ Only add state and city if they have valid values
    if (req.body.state && req.body.state !== '') {
      userData.state = req.body.state;
    }
    
    if (req.body.city && req.body.city !== '') {
      userData.city = req.body.city;
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        f_name: user.f_name,
        l_name: user.l_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt:', { username }); // Debug log

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide username and password' 
      });
    }

    // Find user with password field (important!)
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ User found:', user.username, 'Role:', user.role);

    // Check if password field exists
    if (!user.password) {
      console.log('❌ Password field missing for user:', username);
      return res.status(500).json({ 
        success: false,
        message: 'User data corrupted, please contact admin' 
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful for:', user.username);

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        f_name: user.f_name,
        l_name: user.l_name
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Add this method to your authController.js

// Verify token and return user info
exports.verifyToken = async (req, res) => {
  try {
    // If we reach here, the token is valid (protect middleware verified it)
    // req.user is set by the protect middleware
    
    res.json({
      success: true,
      user: req.user,
      message: 'Token is valid'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('state')
      .populate('city');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      email: req.body.email,
      contact: req.body.contact,
      address: req.body.address,
      qualification: req.body.qualification,
      experience: req.body.experience,
      gender: req.body.gender,
      age: req.body.age,
      dob: req.body.dob
    };

    // ✅ Only update state/city if provided
    if (req.body.state && req.body.state !== '') {
      fieldsToUpdate.state = req.body.state;
    }
    
    if (req.body.city && req.body.city !== '') {
      fieldsToUpdate.city = req.body.city;
    }

    if (req.file) {
      fieldsToUpdate.photo = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


