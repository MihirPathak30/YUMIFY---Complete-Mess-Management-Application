const Order = require('../models/Order');
const Mess = require('../models/Mess');
const { Transaction } = require('../models/Wallet');

// @desc    Get analytics for mess manager
// @route   GET /api/analytics/mess/:messId
// @access  Private (mess_manager)
exports.getMessAnalytics = async (req, res) => {
  try {
    const { messId } = req.params;
    const { period = '30' } = req.query; // days

    // Verify mess ownership
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Total orders
    const totalOrders = await Order.countDocuments({ mess: messId });

    // Recent orders (within period)
    const recentOrders = await Order.countDocuments({
      mess: messId,
      createdAt: { $gte: startDate }
    });

    // Revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          mess: mess._id,
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, avgOrderValue: 0 };

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { mess: mess._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Popular meals
    const popularMeals = await Order.aggregate([
      {
        $match: {
          mess: mess._id,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$meals' },
      {
        $group: {
          _id: '$meals.type',
          count: { $sum: 1 },
          revenue: { $sum: '$meals.price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily order trend (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyTrend = await Order.aggregate([
      {
        $match: {
          mess: mess._id,
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          recentOrders,
          totalRevenue: revenue.totalRevenue,
          avgOrderValue: Math.round(revenue.avgOrderValue),
          totalCustomers: mess.totalCustomers
        },
        ordersByStatus,
        popularMeals,
        dailyTrend
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customer
// @access  Private (customer)
exports.getCustomerAnalytics = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments({ user: req.user.id });

    // Total spent
    const spendingData = await Order.aggregate([
      {
        $match: {
          user: req.user._id,
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalSpent = spendingData.length > 0 ? spendingData[0].totalSpent : 0;

    // Favorite mess
    const favoriteMess = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$mess',
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'messes',
          localField: '_id',
          foreignField: '_id',
          as: 'messInfo'
        }
      },
      { $unwind: '$messInfo' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalSpent,
        avgOrderValue: totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0,
        favoriteMess: favoriteMess.length > 0 ? {
          name: favoriteMess[0].messInfo.name,
          orderCount: favoriteMess[0].orderCount
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer analytics',
      error: error.message
    });
  }
};
