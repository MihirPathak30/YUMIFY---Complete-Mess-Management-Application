const User = require('../models/User');
const Mess = require('../models/Mess');
const Menu = require('../models/Menu');

// @desc    Update user role
// @route   PUT /api/users/role
// @access  Private
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['customer', 'mess_manager'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "customer" or "mess_manager"'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true, runValidators: true }
    );

    // If becoming mess manager, create a default mess
    if (role === 'mess_manager' && !user.messId) {
      const mess = await Mess.create({
        name: `${user.name}'s Mess`,
        owner: user._id,
        description: 'A great place for homely meals',
        address: 'Address to be updated',
        phone: user.phone || 'Phone to be updated',
        cuisineType: 'North Indian',
        amenities: ['Pure Veg', 'Hygienic Kitchen', 'UPI Accepted'],
        specialities: ['Home-style Cooking', 'Fresh Ingredients']
      });

      // Create default weekly menu
      const defaultMenu = [
        { day: 'Monday', breakfast: { name: 'Poha + Tea', price: 40 }, lunch: { name: 'Dal Rice + Roti', price: 70 }, dinner: { name: 'Paneer Curry + Rice', price: 90 } },
        { day: 'Tuesday', breakfast: { name: 'Upma + Coffee', price: 40 }, lunch: { name: 'Rajma Chawal', price: 75 }, dinner: { name: 'Mix Veg + Roti', price: 85 } },
        { day: 'Wednesday', breakfast: { name: 'Paratha + Curd', price: 50 }, lunch: { name: 'Chole Bhature', price: 80 }, dinner: { name: 'Dal Makhani + Rice', price: 95 } },
        { day: 'Thursday', breakfast: { name: 'Idli Sambar', price: 45 }, lunch: { name: 'Kadhi Chawal', price: 70 }, dinner: { name: 'Butter Paneer + Naan', price: 100 } },
        { day: 'Friday', breakfast: { name: 'Aloo Paratha', price: 55 }, lunch: { name: 'Biryani + Raita', price: 90 }, dinner: { name: 'Thali Special', price: 110 } },
        { day: 'Saturday', breakfast: { name: 'Dosa + Chutney', price: 50 }, lunch: { name: 'Pav Bhaji', price: 75 }, dinner: { name: 'Paneer Tikka', price: 95 } },
        { day: 'Sunday', breakfast: { name: 'Chole Bhature', price: 60 }, lunch: { name: 'Special Thali', price: 100 }, dinner: { name: 'Malai Kofta', price: 110 } }
      ];

      await Menu.create({
        mess: mess._id,
        weeklyMenu: defaultMenu
      });

      user.messId = mess._id;
      await user.save();
    }

    res.status(200).json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('messId');
    
    res.status(200).json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};
