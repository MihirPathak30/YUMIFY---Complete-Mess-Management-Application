const Mess = require('../models/Mess');
const Order = require('../models/Order');

// Simple rule-based AI assistant (no paid APIs)
// This provides helpful responses based on user queries

// @desc    Chat with AI assistant
// @route   POST /api/ai-assistant/chat
// @access  Private (customer)
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    // Help with finding messes
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('mess')) {
      const messes = await Mess.find({ isActive: true, isOpen: true })
        .sort({ 'rating.average': -1 })
        .limit(3);
      
      if (messes.length > 0) {
        response = `I found ${messes.length} popular messes for you:\n\n`;
        messes.forEach((mess, idx) => {
          response += `${idx + 1}. ${mess.name} - ${mess.cuisineType} (Rating: ${mess.rating.average}⭐)\n`;
        });
        response += '\nWould you like to know more about any of these?';
      } else {
        response = 'Sorry, I could not find any messes at the moment. Please try again later.';
      }
    }
    // Help with orders
    else if (lowerMessage.includes('order') || lowerMessage.includes('booking')) {
      const recentOrders = await Order.find({ user: req.user.id })
        .populate('mess', 'name')
        .sort({ createdAt: -1 })
        .limit(1);
      
      if (recentOrders.length > 0) {
        const order = recentOrders[0];
        response = `Your most recent order was from ${order.mess.name} for ₹${order.totalAmount}. `;
        response += `Status: ${order.status}.\n\n`;
        response += 'To place a new order, browse messes from the home page and select your meals!';
      } else {
        response = 'You haven\'t placed any orders yet. Browse messes from the home page to get started!';
      }
    }
    // Recommendations
    else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
      const topMesses = await Mess.find({ isActive: true })
        .sort({ 'rating.average': -1, popular: -1 })
        .limit(3);
      
      response = '🌟 Based on ratings and popularity, I recommend:\n\n';
      topMesses.forEach((mess, idx) => {
        response += `${idx + 1}. ${mess.name} - ${mess.cuisineType}\n`;
        response += `   Rating: ${mess.rating.average}⭐ | ${mess.priceRange.min}-${mess.priceRange.max}\n\n`;
      });
    }
    // Pricing info
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap')) {
      const affordableMesses = await Mess.find({ isActive: true })
        .sort({ 'priceRange.min': 1 })
        .limit(3);
      
      response = '💰 Most affordable options:\n\n';
      affordableMesses.forEach((mess, idx) => {
        response += `${idx + 1}. ${mess.name}\n`;
        response += `   Price Range: ₹${mess.priceRange.min} - ₹${mess.priceRange.max}\n\n`;
      });
    }
    // Cuisine specific
    else if (lowerMessage.includes('north indian') || lowerMessage.includes('south indian') || 
             lowerMessage.includes('chinese') || lowerMessage.includes('cuisine')) {
      let cuisine = 'North Indian'; // default
      if (lowerMessage.includes('south')) cuisine = 'South Indian';
      if (lowerMessage.includes('chinese')) cuisine = 'Chinese';
      
      const messes = await Mess.find({ cuisineType: cuisine, isActive: true }).limit(3);
      
      if (messes.length > 0) {
        response = `I found ${messes.length} ${cuisine} messes:\n\n`;
        messes.forEach((mess, idx) => {
          response += `${idx + 1}. ${mess.name} (${mess.rating.average}⭐)\n`;
        });
      } else {
        response = `Sorry, no ${cuisine} messes available right now.`;
      }
    }
    // Timing info
    else if (lowerMessage.includes('timing') || lowerMessage.includes('open') || lowerMessage.includes('hours')) {
      response = 'Most messes operate from 7 AM to 10 PM. You can check specific timings on each mess\'s detail page.';
    }
    // Payment help
    else if (lowerMessage.includes('payment') || lowerMessage.includes('wallet') || lowerMessage.includes('pay')) {
      response = 'Yumify supports multiple payment methods:\n\n';
      response += '💳 Wallet: Add money to your wallet and pay instantly\n';
      response += '💵 Cash: Pay directly at the mess\n';
      response += '📱 UPI: Quick digital payments\n\n';
      response += 'You can add money to your wallet from the Wallet page.';
    }
    // Help/default
    else {
      response = 'Hello! I\'m your Yumify Assistant. I can help you with:\n\n';
      response += '🔍 Finding and recommending messes\n';
      response += '📝 Checking your orders\n';
      response += '💰 Price comparisons\n';
      response += '🍛 Cuisine-specific suggestions\n';
      response += '⏰ Timing information\n';
      response += '💳 Payment methods\n\n';
      response += 'Just ask me anything!';
    }

    res.status(200).json({
      success: true,
      data: {
        message: response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message
    });
  }
};

// @desc    Get chat suggestions
// @route   GET /api/ai-assistant/suggestions
// @access  Private
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      'Find me the best messes',
      'Recommend affordable options',
      'Show my recent orders',
      'What are the popular messes?',
      'How do I add money to wallet?',
      'Find North Indian messes',
      'What are the timings?'
    ];

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
};
