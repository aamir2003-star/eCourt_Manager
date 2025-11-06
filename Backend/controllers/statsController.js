// backend/controllers/statsController.js
const Case = require('../models/Case');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
  try {
    // Cases per month
    const casesByMonth = await Case.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Case status distribution
    const caseStatusDistribution = await Case.aggregate([
      {
        $group: {
          _id: '$case_status',
          count: { $sum: 1 }
        }
      }
    ]);

    // New users per month
    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date_of_reg' }, month: { $month: '$date_of_reg' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        casesByMonth,
        caseStatusDistribution,
        usersByMonth
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};