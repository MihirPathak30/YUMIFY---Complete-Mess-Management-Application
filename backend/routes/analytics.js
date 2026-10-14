const express = require('express');
const router = express.Router();
const {
  getMessAnalytics,
  getCustomerAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/mess/:messId', protect, authorize('mess_manager'), getMessAnalytics);
router.get('/customer', protect, authorize('customer'), getCustomerAnalytics);

module.exports = router;
