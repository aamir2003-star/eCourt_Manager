// routes/appointment.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

// Create appointment
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      client: req.user.id
    });

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query.client = req.user.id;
    } else if (req.user.role === 'staff') {
      query.staff = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'f_name l_name email contact')
      .populate('staff', 'f_name l_name email contact')
      .sort('-date');

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;