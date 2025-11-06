// routes/user.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, getLawyers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getAllUsers);

router.route('/lawyers').get(protect, authorize('client'), getLawyers);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;