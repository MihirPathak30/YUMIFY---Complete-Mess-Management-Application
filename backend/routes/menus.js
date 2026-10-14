const express = require('express');
const router = express.Router();
const {
  getMenuByMess,
  updateMenu,
  updateDayMenu
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public route
router.get('/mess/:messId', getMenuByMess);

// Protected routes - mess manager only
router.put('/mess/:messId', protect, authorize('mess_manager'), updateMenu);
router.put('/mess/:messId/day/:day', protect, authorize('mess_manager'), updateDayMenu);

module.exports = router;
