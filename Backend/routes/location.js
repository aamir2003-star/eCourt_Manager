// routes/location.js
const express = require('express');
const router = express.Router();
const State = require('../models/State');
const City = require('../models/City');
const { protect } = require('../middleware/auth.js');

const { authorize } = require('../middleware/auth.js');
// States
router.get('/states', async (req, res) => {
  try {
    const states = await State.find().sort('state_name');
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/states', protect, authorize('admin'), async (req, res) => {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cities
router.get('/cities', async (req, res) => {
  try {
    let query = {};
    if (req.query.state) {
      query.state = req.query.state;
    }
    const cities = await City.find(query).populate('state').sort('city_name');
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cities', protect, authorize('admin'), async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;