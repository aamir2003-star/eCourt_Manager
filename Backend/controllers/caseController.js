// controllers/caseController.js - CORRECTED VERSION
const Case = require('../models/Case');
const Notification = require('../models/Notification');
const User = require('../models/User'); // ✅ ADD THIS IMPORT

// Get socket.io instance safely
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

    // Admin sees all cases
    if (userRole === 'admin') {
      // No filter
    }
    // Client sees only their cases
    else if (userRole === 'client') {
      query.client = userId;
    }
    // Staff sees only assigned cases
    else if (userRole === 'staff') {
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

// Get single case (with access control)
exports.getCase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const caseData = await Case.findById(id)
      .populate('client', 'f_name l_name email phone')
      .populate('assigned_staff', 'f_name l_name role email')
      .populate('primary_lawyer', 'f_name l_name role email')
      .populate('documents')
      .populate('hearings')
      .populate('city', 'city_name state');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Check access
    if (userRole === 'admin') {
      // Admin can access all
    } else if (userRole === 'client') {
      if (caseData.client._id.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This case does not belong to you.'
        });
      }
    } else if (userRole === 'staff') {
      const isAssigned = caseData.assigned_staff && caseData.assigned_staff.some(
        staff => staff._id.toString() === userId.toString()
      );
      const isPrimaryLawyer = caseData.primary_lawyer && 
        caseData.primary_lawyer._id.toString() === userId.toString();

      if (!isAssigned && !isPrimaryLawyer) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not assigned to this case.'
        });
      }
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
    // Allow both admin and client to create cases
    const newCase = new Case({
      ...req.body,
      created_by: req.user._id,
      client: req.body.client || req.user._id // ✅ FIXED: Set client
    });

    await newCase.save();

    // ✅ FIXED: Notify admin about new case request
    try {
      // Get all admin users
      const admins = await User.find({ role: 'admin' });
      
      if (admins && admins.length > 0) {
        const notificationData = admins.map(admin => ({
          recipient: admin._id,  // ✅ Must include recipient
          sender: req.user._id,
          type: 'case_request',  // ✅ Use valid enum value
          title: 'New Case Request',
          message: `New case request: ${newCase.case_title}`,
          relatedCase: newCase._id,
          actionUrl: `/admin/cases/${newCase._id}`,
          priority: 'high'
        }));

        await Notification.insertMany(notificationData);

        // Emit Socket.io event to admins
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
      // Don't fail the case creation if notification fails
    }

    // ✅ FIXED: Also notify assigned staff if provided
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

        // Emit Socket.io event
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

    // Notify if status changed
    if (oldCase.status !== req.body.status) {
      try {
        // Notify client
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

        // Notify assigned staff
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

        // Emit Socket.io event
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

    // Notify assigned staff
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

        // Emit Socket.io event
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

    // Your document upload logic here
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

    // Your hearing schedule logic here
    res.json({
      success: true,
      message: 'Hearing scheduled successfully',
      data: {
        caseId,
        hearing_date,
        remarks
      }
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
