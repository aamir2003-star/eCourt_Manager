// controllers/caseController.js - FIXED getCase function (COMPLETE FILE)
const Case = require('../models/Case');
const Notification = require('../models/Notification');
const User = require('../models/User');

let io;
try {
  io = require('../server').io;
} catch (error) {
  console.warn('Socket.io not available in this context');
  io = null;
}

// Get cases based on user role and access
exports.getCases = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'admin') {
      // No filter
    } else if (userRole === 'client') {
      query.client = userId;
    } else if (userRole === 'staff') {
      query.$or = [
        { assigned_staff: userId },
        { primary_lawyer: userId }
      ];
    }

    const cases = await Case.find(query)
      .populate('client', 'f_name l_name email')
      .populate('assigned_staff', 'f_name l_name role')
      .populate('primary_lawyer', 'f_name l_name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cases',
      error: error.message
    });
  }
};

// ✅ FIXED: Get single case (with better access control)
exports.getCase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log(`Getting case ${id} for user ${userId} with role ${userRole}`);

    const caseData = await Case.findById(id)
      .populate('client', 'f_name l_name email phone')
      .populate('assigned_staff', 'f_name l_name role email')
      .populate('primary_lawyer', 'f_name l_name role email')
      .populate('documents')
      .populate('hearings')
      .populate('city', 'city_name state');

    if (!caseData) {
      console.log(`Case ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // ✅ FIXED: Better access control with null checks
    let hasAccess = false;

    if (userRole === 'admin') {
      // Admins can access all cases
      hasAccess = true;
      console.log(`Admin access granted`);
    } else if (userRole === 'client') {
      // Clients can access only their own cases
      if (caseData.client && caseData.client._id.toString() === userId.toString()) {
        hasAccess = true;
        console.log(`Client access granted - case belongs to them`);
      } else {
        console.log(`Client access denied - case doesn't belong to them`);
      }
    } else if (userRole === 'staff') {
      // Staff can access cases they are assigned to
      const isAssigned = caseData.assigned_staff && caseData.assigned_staff.some(
        staff => staff._id.toString() === userId.toString()
      );
      
      const isPrimaryLawyer = caseData.primary_lawyer && 
        caseData.primary_lawyer._id.toString() === userId.toString();

      if (isAssigned) {
        hasAccess = true;
        console.log(`Staff access granted - assigned to case`);
      } else if (isPrimaryLawyer) {
        hasAccess = true;
        console.log(`Staff access granted - is primary lawyer`);
      } else {
        console.log(`Staff access denied - not assigned or primary lawyer`);
      }
    }

    if (!hasAccess) {
      console.log(`Access denied for user ${userId} to case ${id}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this case.'
      });
    }

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case',
      error: error.message
    });
  }
};

// Create case (for clients & admin)
exports.createCase = async (req, res) => {
  try {
    const newCase = new Case({
      ...req.body,
      created_by: req.user._id,
      client: req.body.client || req.user._id
    });

    await newCase.save();

    try {
      const admins = await User.find({ role: 'admin' });
      
      if (admins && admins.length > 0) {
        const notificationData = admins.map(admin => ({
          recipient: admin._id,
          sender: req.user._id,
          type: 'case_request',
          title: 'New Case Request',
          message: `New case request: ${newCase.case_title}`,
          relatedCase: newCase._id,
          actionUrl: `/admin/cases/${newCase._id}`,
          priority: 'high'
        }));

        await Notification.insertMany(notificationData);

        if (io) {
          io.to('role_admin').emit('new_case_request', {
            caseId: newCase._id,
            case_title: newCase.case_title,
            client: req.user._id,
            timestamp: new Date()
          });
        }
      }
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError);
    }

    if (req.body.assigned_staff && req.body.assigned_staff.length > 0) {
      try {
        await Notification.insertMany(
          req.body.assigned_staff.map(staffId => ({
            recipient: staffId,
            sender: req.user._id,
            type: 'case_assigned',
            title: 'New Case Assigned',
            message: `You have been assigned to case: ${newCase.case_title}`,
            relatedCase: newCase._id,
            actionUrl: `/staff/cases/${newCase._id}`,
            priority: 'high'
          }))
        );

        if (io) {
          io.to('role_staff').emit('case_assigned', {
            caseId: newCase._id,
            case_title: newCase.case_title,
            assignedStaff: req.body.assigned_staff
          });
        }
      } catch (notificationError) {
        console.error('Staff notification error:', notificationError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create case',
      error: error.message
    });
  }
};

// Update case (only admin)
exports.updateCase = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update case details'
      });
    }

    const { id } = req.params;
    const oldCase = await Case.findById(id);

    if (!oldCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { ...req.body, updated_by: req.user._id },
      { new: true, runValidators: true }
    );

    if (oldCase.status !== req.body.status) {
      try {
        if (updatedCase.client) {
          await Notification.create({
            recipient: updatedCase.client,
            sender: req.user._id,
            type: 'case_updated',
            title: 'Case Status Updated',
            message: `Your case "${updatedCase.case_title}" status changed to ${updatedCase.status}`,
            relatedCase: updatedCase._id,
            actionUrl: `/client/cases/${updatedCase._id}`,
            priority: 'high'
          });
        }

        if (updatedCase.assigned_staff && updatedCase.assigned_staff.length > 0) {
          await Notification.insertMany(
            updatedCase.assigned_staff.map(staffId => ({
              recipient: staffId,
              sender: req.user._id,
              type: 'case_updated',
              title: 'Case Status Updated',
              message: `Case "${updatedCase.case_title}" status changed to ${updatedCase.status}`,
              relatedCase: updatedCase._id,
              actionUrl: `/staff/cases/${updatedCase._id}`
            }))
          );
        }

        if (io) {
          io.emit('case_status_updated', {
            caseId: updatedCase._id,
            case_title: updatedCase.case_title,
            status: updatedCase.status
          });
        }
      } catch (notificationError) {
        console.error('Notification creation error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Case updated successfully',
      data: updatedCase
    });
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case',
      error: error.message
    });
  }
};

// Delete case (only admin)
exports.deleteCase = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete cases'
      });
    }

    const { id } = req.params;
    const deletedCase = await Case.findByIdAndDelete(id);

    if (!deletedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.json({
      success: true,
      message: 'Case deleted successfully',
      data: deletedCase
    });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case',
      error: error.message
    });
  }
};

// Assign staff to case
exports.assignStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can assign staff'
      });
    }

    const { id } = req.params;
    const { assigned_staff, primary_lawyer } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Case ID is required'
      });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
        assigned_staff: assigned_staff || [],
        primary_lawyer: primary_lawyer || null,
        updated_by: req.user._id
      },
      { new: true }
    ).populate('assigned_staff', 'f_name l_name email').populate('primary_lawyer', 'f_name l_name');

    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    if (assigned_staff && assigned_staff.length > 0) {
      try {
        await Notification.insertMany(
          assigned_staff.map(staffId => ({
            recipient: staffId,
            sender: req.user._id,
            type: 'case_assigned',
            title: 'Case Assignment',
            message: `You have been assigned to case: ${updatedCase.case_title}`,
            relatedCase: updatedCase._id,
            actionUrl: `/staff/cases/${updatedCase._id}`,
            priority: 'high'
          }))
        );

        if (io) {
          assigned_staff.forEach(staffId => {
            io.to(`user_${staffId}`).emit('case_assigned', {
              caseId: updatedCase._id,
              case_title: updatedCase.case_title,
              message: 'You have been assigned to a new case',
              priority: 'high'
            });
          });
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Staff assigned successfully',
      data: updatedCase
    });
  } catch (error) {
    console.error('Assign staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign staff',
      error: error.message
    });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        fileName: req.file.filename,
        caseId
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
};

const CaseHearing = require('../models/CaseHearing');

// Schedule hearing
exports.scheduleHearing = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { hearing_date, remarks } = req.body;

    if (!hearing_date) {
      return res.status(400).json({
        success: false,
        message: 'Hearing date is required'
      });
    }

    const newHearing = new CaseHearing({
      case: caseId,
      hearing_date,
      remarks
    });

    await newHearing.save();

    await Case.findByIdAndUpdate(caseId, {
      $push: { hearings: newHearing._id }
    });

    res.json({
      success: true,
      message: 'Hearing scheduled successfully',
      data: newHearing
    });
  } catch (error) {
    console.error('Schedule hearing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule hearing',
      error: error.message
    });
  }
};

// ✅ ACCEPT CASE FUNCTION
exports.acceptCase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const isAssigned = caseData.assigned_staff && caseData.assigned_staff.some(
      staffId => staffId.toString() === userId.toString()
    );

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this case'
      });
    }

    if (caseData.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Case is already accepted'
      });
    }

    caseData.status = 'active';
    caseData.accepted_by = userId;
    caseData.accepted_at = new Date();
    caseData.updated_by = userId;
    await caseData.save();

    try {
      await Notification.create({
        recipient: caseData.client,
        sender: userId,
        type: 'case_updated',
        title: 'Case Accepted ✅',
        message: `Your case "${caseData.case_title}" has been accepted by ${req.user.f_name} ${req.user.l_name}`,
        relatedCase: caseData._id,
        actionUrl: `/client/cases/${caseData._id}`,
        priority: 'high'
      });

      if (io) {
        io.to(`user_${caseData.client}`).emit('case_accepted', {
          caseId: caseData._id,
          case_title: caseData.case_title,
          acceptedBy: `${req.user.f_name} ${req.user.l_name}`,
          message: 'Your case has been accepted'
        });
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    });
  }
};

exports.getMyHearings = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'client') {
      query.client = userId;
    } else if (userRole === 'staff') {
      query.$or = [
        { assigned_staff: userId },
        { primary_lawyer: userId }
      ];
    }

    const cases = await Case.find(query).select('_id');
    const caseIds = cases.map(c => c._id);

    const hearings = await CaseHearing.find({ case: { $in: caseIds } }).populate('case', 'case_title');

    res.json({
      success: true,
      count: hearings.length,
      data: hearings
    });
  } catch (error) {
    console.error('Get my hearings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hearings',
      error: error.message
    });
  }
};
