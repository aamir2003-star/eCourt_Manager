// middleware/caseAccess.js - NEW
const Case = require('../models/Case');

// Check if user has access to view a case
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

// Check if user can modify a case
exports.checkCaseModifyAccess = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    // Only admin can modify case details
    if (userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Only admins can modify case details.' 
      });
    }

    next();
  } catch (error) {
    console.error('Case modify access check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
