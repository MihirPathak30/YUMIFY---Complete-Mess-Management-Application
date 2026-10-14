const Menu = require('../models/Menu');
const Mess = require('../models/Mess');

// @desc    Get menu by mess ID
// @route   GET /api/menus/mess/:messId
// @access  Public
exports.getMenuByMess = async (req, res) => {
  try {
    const menu = await Menu.findOne({ mess: req.params.messId });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found for this mess'
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu',
      error: error.message
    });
  }
};

// @desc    Update menu
// @route   PUT /api/menus/mess/:messId
// @access  Private (mess_manager - owner only)
exports.updateMenu = async (req, res) => {
  try {
    const { messId } = req.params;
    const { weeklyMenu } = req.body;

    // Check if mess exists and user owns it
    const mess = await Mess.findById(messId);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Verify ownership
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu'
      });
    }

    // Find or create menu
    let menu = await Menu.findOne({ mess: messId });

    if (menu) {
      // Update existing menu
      menu.weeklyMenu = weeklyMenu;
      menu.lastUpdated = Date.now();
      await menu.save();
    } else {
      // Create new menu
      menu = await Menu.create({
        mess: messId,
        weeklyMenu,
        lastUpdated: Date.now()
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu',
      error: error.message
    });
  }
};

// @desc    Update single day menu
// @route   PUT /api/menus/mess/:messId/day/:day
// @access  Private (mess_manager - owner only)
exports.updateDayMenu = async (req, res) => {
  try {
    const { messId, day } = req.params;
    const { breakfast, lunch, dinner } = req.body;

    // Check if mess exists and user owns it
    const mess = await Mess.findById(messId);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Verify ownership
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu'
      });
    }

    // Find menu
    const menu = await Menu.findOne({ mess: messId });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Find day and update
    const dayIndex = menu.weeklyMenu.findIndex(d => d.day === day);

    if (dayIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Day ${day} not found in menu`
      });
    }

    if (breakfast) menu.weeklyMenu[dayIndex].breakfast = breakfast;
    if (lunch) menu.weeklyMenu[dayIndex].lunch = lunch;
    if (dinner) menu.weeklyMenu[dayIndex].dinner = dinner;

    menu.lastUpdated = Date.now();
    await menu.save();

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating day menu',
      error: error.message
    });
  }
};
