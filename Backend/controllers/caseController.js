
// controllers/caseController.js
const Case = require('../models/Case');
const CaseDocument = require('../models/CaseDocument');
const CaseHearing = require('../models/CaseHearing');
const sendEmail = require('../utils/sendEmail');

exports.createCase = async (req, res) => {
  try {
    const caseData = {
      ...req.body,
      staff: req.user.role === 'staff' ? req.user.id : req.body.staff
    };

    if (req.file) {
      caseData.fir_copy = req.file.path;
    }

    const newCase = await Case.create(caseData);
    
    res.status(201).json({
      success: true,
      data: newCase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'staff') {
      query.staff = req.user.id;
    } else if (req.user.role === 'client') {
      query.client = req.user.id;
    }

    const cases = await Case.find(query)
      .populate('staff', 'f_name l_name email')
      .populate('client', 'f_name l_name email')
      .populate('state')
      .populate('city')
      .sort('-createdAt');

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate('staff', 'f_name l_name email contact')
      .populate('client', 'f_name l_name email contact')
      .populate('state')
      .populate('city');

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const documents = await CaseDocument.find({ case: req.params.id });
    const hearings = await CaseHearing.find({ case: req.params.id }).sort('hearing_date');

    res.json({
      success: true,
      data: {
        ...caseData.toObject(),
        documents,
        hearings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    let caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (req.user.role === 'staff' && caseData.staff.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this case' });
    }

    caseData = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    await CaseDocument.deleteMany({ case: req.params.id });
    await CaseHearing.deleteMany({ case: req.params.id });
    await caseData.deleteOne();

    res.json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const document = await CaseDocument.create({
      case: req.params.caseId,
      case_title: req.body.case_title,
      description: req.body.description,
      file: req.file.path
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scheduleHearing = async (req, res) => {
  try {
    const hearing = await CaseHearing.create({
      case: req.params.caseId,
      hearing_date: req.body.hearing_date,
      remarks: req.body.remarks
    });

    const caseData = await Case.findById(req.params.caseId).populate('client');
    
    // Send notification email
    try {
      await sendEmail({
        email: caseData.client.email,
        subject: 'Court Hearing Scheduled',
        message: `A hearing has been scheduled for case ${caseData.case_title} on ${new Date(req.body.hearing_date).toLocaleDateString()}`
      });
    } catch (emailError) {
      console.log('Email notification failed:', emailError);
    }

    res.status(201).json({
      success: true,
      data: hearing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
