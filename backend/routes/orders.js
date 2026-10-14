const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getMessOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', protect, authorize('customer'), createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Mess manager routes
router.get('/mess/:messId', protect, authorize('mess_manager'), getMessOrders);
router.put('/:id/status', protect, authorize('mess_manager'), updateOrderStatus);

module.exports = router;
