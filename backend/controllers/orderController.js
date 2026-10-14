const Order = require('../models/Order');
const Mess = require('../models/Mess');
const { Wallet, Transaction } = require('../models/Wallet');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (customer)
exports.createOrder = async (req, res) => {
  try {
    const { messId, meals, orderDate, totalAmount, paymentMethod } = req.body;

    // Validation
    if (!messId || !meals || !totalAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify mess exists
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // If payment method is wallet, verify balance and deduct
    if (paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ user: req.user.id });
      
      if (!wallet || wallet.balance < totalAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }

      // Deduct from wallet
      const newBalance = wallet.balance - totalAmount;
      wallet.balance = newBalance;
      await wallet.save();

      // Create transaction
      await Transaction.create({
        user: req.user.id,
        type: 'debit',
        amount: totalAmount,
        description: `Payment - ${mess.name}`,
        balanceAfter: newBalance
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      mess: messId,
      meals,
      orderDate: orderDate || new Date(),
      totalAmount,
      paymentMethod,
      status: 'confirmed'
    });

    // Populate mess and user info
    await order.populate('mess', 'name address phone');
    await order.populate('user', 'name email phone');

    // Increment mess customer count
    await Mess.findByIdAndUpdate(messId, { $inc: { totalCustomers: 1 } });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    let query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('mess', 'name address phone image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('mess', 'name address phone image')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user is order owner or mess owner
    const mess = await Mess.findById(order.mess._id);
    if (order.user._id.toString() !== req.user.id && mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get orders for mess (manager view)
// @route   GET /api/orders/mess/:messId
// @access  Private (mess_manager)
exports.getMessOrders = async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;

    // Verify mess ownership
    const mess = await Mess.findById(req.params.messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders'
      });
    }

    let query = { mess: req.params.messId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mess orders',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (mess_manager)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id).populate('mess');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify mess ownership
    const mess = await Mess.findById(order.mess._id);
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Handle refund if order is cancelled
    if (status === 'cancelled' && order.status !== 'cancelled' && order.paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ user: order.user });
      if (wallet) {
        const newBalance = wallet.balance + order.totalAmount;
        wallet.balance = newBalance;
        await wallet.save();

        await Transaction.create({
          user: order.user,
          type: 'credit',
          amount: order.totalAmount,
          description: `Refund - ${mess.name}`,
          balanceAfter: newBalance,
          referenceId: order._id.toString()
        });
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: `Order ${status} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Cancel order (customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private (customer)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('mess', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can't cancel if already completed or cancelled
    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${order.status} order`
      });
    }

    // Refund to wallet if paid via wallet
    if (order.paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ user: req.user.id });
      if (wallet) {
        const newBalance = wallet.balance + order.totalAmount;
        wallet.balance = newBalance;
        await wallet.save();

        await Transaction.create({
          user: req.user.id,
          type: 'credit',
          amount: order.totalAmount,
          description: `Refund - ${order.mess.name}`,
          balanceAfter: newBalance,
          referenceId: order._id.toString()
        });
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};
