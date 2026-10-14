const express = require('express');
const router = express.Router();
const {
  getMessReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public route
router.get('/mess/:messId', getMessReviews);

// Protected routes - customer only
router.post('/', protect, authorize('customer'), createReview);
router.put('/:id', protect, authorize('customer'), updateReview);
router.delete('/:id', protect, authorize('customer'), deleteReview);

module.exports = router;
