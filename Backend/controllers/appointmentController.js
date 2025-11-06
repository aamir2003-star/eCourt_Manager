// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

let io;
try {
  io = require('../server').io;
} catch (error) {
  console.warn('Socket.io not available in this context');
  io = null;
}

// Create appointment (client)
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      client: req.user._id
    });

    await appointment.save();

    try {
      const staffMembers = await User.find({ role: 'staff' });
      
      if (staffMembers && staffMembers.length > 0) {
        const notificationData = staffMembers.map(staff => ({
          recipient: staff._id,
          sender: req.user._id,
          type: 'appointment_request',
          title: 'New Appointment Request',
          message: `New appointment request from ${req.user.f_name} ${req.user.l_name}`,
          relatedAppointment: appointment._id,
          actionUrl: `/staff/appointments`,
          priority: 'medium'
        }));

        await Notification.insertMany(notificationData);

        if (io) {
          io.to('role_staff').emit('new_appointment_request', {
            appointmentId: appointment._id,
            clientName: `${req.user.f_name} ${req.user.l_name}`,
            date: appointment.date
          });
        }
      }
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment requested successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request appointment',
      error: error.message
    });
  }
};

// Get appointments (for current user)
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'client') {
      query.client = userId;
    } else if (userRole === 'staff') {
      // Staff can see all appointments to manage them
      // Or change to: query.staff = userId; if they only see their own
    } else if (userRole === 'admin') {
      // Admins can see all appointments
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'f_name l_name email')
      .populate('staff', 'f_name l_name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Update appointment (staff/admin)
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staff, date, time } = req.body;

    const oldAppointment = await Appointment.findById(id);

    if (!oldAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, staff, date, time, updated_by: req.user._id },
      { new: true, runValidators: true }
    );

    if (oldAppointment.status !== status) {
      try {
        await Notification.create({
          recipient: updatedAppointment.client,
          sender: req.user._id,
          type: 'appointment_updated',
          title: `Appointment ${status}`,
          message: `Your appointment on ${new Date(date).toLocaleDateString()} has been ${status}`,
          relatedAppointment: updatedAppointment._id,
          actionUrl: `/client/appointments`,
          priority: 'high'
        });

        if (io) {
          io.to(`user_${updatedAppointment.client}`).emit('appointment_status_changed', {
            appointmentId: updatedAppointment._id,
            status: updatedAppointment.status
          });
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Delete appointment (admin)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
};