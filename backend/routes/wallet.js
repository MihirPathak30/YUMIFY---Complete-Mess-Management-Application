const express = require('express');
const router = express.Router();
const {
  getWallet,
  addMoney,
  withdrawMoney,
  getTransactions
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWallet);
router.post('/add', protect, addMoney);
router.post('/withdraw', protect, withdrawMoney);
router.get('/transactions', protect, getTransactions);

module.exports = router;
