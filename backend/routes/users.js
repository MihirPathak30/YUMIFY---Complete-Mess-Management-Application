const express = require('express');
const router = express.Router();
const { updateRole, updateProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/role', protect, updateRole);
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
