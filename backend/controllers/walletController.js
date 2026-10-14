const { Wallet, Transaction } = require('../models/Wallet');

// @desc    Get wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    // Get or create wallet
    let wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id, balance: 0 });
    }

    // Get recent transactions
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet',
      error: error.message
    });
  }
};

// @desc    Add money to wallet
// @route   POST /api/wallet/add
// @access  Private
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id, balance: 0 });
    }

    // Update balance
    const newBalance = wallet.balance + amount;
    wallet.balance = newBalance;
    await wallet.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'credit',
      amount,
      description: 'Added to Wallet',
      balanceAfter: newBalance
    });

    res.status(200).json({
      success: true,
      data: {
        balance: newBalance,
        transaction
      },
      message: `₹${amount} added successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding money',
      error: error.message
    });
  }
};

// @desc    Withdraw money from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
exports.withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Update balance
    const newBalance = wallet.balance - amount;
    wallet.balance = newBalance;
    await wallet.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'debit',
      amount,
      description: 'Withdrawn to Bank',
      balanceAfter: newBalance
    });

    res.status(200).json({
      success: true,
      data: {
        balance: newBalance,
        transaction
      },
      message: `₹${amount} withdrawn successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error withdrawing money',
      error: error.message
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { limit = 100, type } = req.query;

    let query = { user: req.user.id };
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};
