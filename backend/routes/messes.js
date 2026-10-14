const express = require('express');
const router = express.Router();
const {
  getAllMesses,
  getMess,
  createMess,
  updateMess,
  deleteMess,
  getMyMess
} = require('../controllers/messController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllMesses);
router.get('/:id', getMess);

// Protected routes - mess manager only
router.get('/my/mess', protect, authorize('mess_manager'), getMyMess);
router.post('/', protect, authorize('mess_manager'), createMess);
router.put('/:id', protect, authorize('mess_manager'), updateMess);
router.delete('/:id', protect, authorize('mess_manager'), deleteMess);

module.exports = router;
