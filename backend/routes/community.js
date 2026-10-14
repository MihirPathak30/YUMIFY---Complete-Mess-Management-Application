const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostsByMess,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/communityController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllPosts);
router.get('/mess/:messId', getPostsByMess);

// Protected routes - mess manager only
router.post('/', protect, authorize('mess_manager'), createPost);
router.put('/:id', protect, authorize('mess_manager'), updatePost);
router.delete('/:id', protect, authorize('mess_manager'), deletePost);

module.exports = router;
