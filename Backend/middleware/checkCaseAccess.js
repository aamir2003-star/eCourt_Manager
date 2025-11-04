// middleware/auth.js - UPDATED
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Case = require('../models/Case');
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

// NEW: Check case access for viewing
exports.checkCaseAccess = async (req, res, next) => {
  try {
    const caseId = req.params.id || req.params.caseId || req.body.caseId;
    const userId = req.user._id;
    const userRole = req.user.role;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Admin can access all cases
    if (userRole === 'admin') {
      req.case = caseData;
      return next();
    }

    // Client can only access their own cases
    if (userRole === 'client') {
      if (caseData.client.toString() !== userId.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. This case does not belong to you.' 
        });
      }
      req.case = caseData;
      return next();
    }

    // Staff can only access assigned cases
    if (userRole === 'staff') {
      const isAssigned = caseData.assigned_staff.some(
        staffId => staffId.toString() === userId.toString()
      );

      const isPrimaryLawyer = caseData.primary_lawyer && 
        caseData.primary_lawyer.toString() === userId.toString();

      if (!isAssigned && !isPrimaryLawyer) {
        return res.status(403).json({ 
          message: 'Access denied. You are not assigned to this case.' 
        });
      }

      req.case = caseData;
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('Case access check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Verify Socket.io token
exports.verifySocketToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { valid: true, userId: decoded.id, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
