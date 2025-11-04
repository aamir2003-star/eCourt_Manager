// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/auth');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add token to request for Socket.io use
    req.token = token;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// New middleware for Socket.io token verification
exports.verifySocketToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { valid: true, userId: decoded.id, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
