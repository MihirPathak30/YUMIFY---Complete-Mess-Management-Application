const Mess = require('../models/Mess');
const Menu = require('../models/Menu');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get all messes
// @route   GET /api/messes
// @access  Public (for customers to browse)
exports.getAllMesses = async (req, res) => {
  try {
    const { search, cuisineType, isOpen } = req.query;

    let query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (cuisineType) {
      query.cuisineType = cuisineType;
    }

    if (isOpen !== undefined) {
      query.isOpen = isOpen === 'true';
    }

    const messes = await Mess.find(query)
      .populate('owner', 'name email')
      .sort({ popular: -1, 'rating.average': -1 });

    res.status(200).json({
      success: true,
      count: messes.length,
      data: messes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messes',
      error: error.message
    });
  }
};

// @desc    Get single mess by ID
// @route   GET /api/messes/:id
// @access  Public
exports.getMess = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id).populate('owner', 'name email phone');

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Get menu for this mess
    const menu = await Menu.findOne({ mess: mess._id });

    // Get reviews for this mess
    const reviews = await Review.find({ mess: mess._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...mess.toObject(),
        menu: menu ? menu.weeklyMenu : [],
        reviews: reviews
      }
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching mess',
      error: error.message
    });
  }
};

// @desc    Create new mess (for mess managers)
// @route   POST /api/messes
// @access  Private (mess_manager)
exports.createMess = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    // Check if user already has a mess
    const existingMess = await Mess.findOne({ owner: req.user.id });
    if (existingMess) {
      return res.status(400).json({
        success: false,
        message: 'You already have a mess registered'
      });
    }

    const mess = await Mess.create(req.body);

    // Update user's messId
    await User.findByIdAndUpdate(req.user.id, { messId: mess._id });

    res.status(201).json({
      success: true,
      data: mess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating mess',
      error: error.message
    });
  }
};

// @desc    Update mess
// @route   PUT /api/messes/:id
// @access  Private (mess_manager - owner only)
exports.updateMess = async (req, res) => {
  try {
    let mess = await Mess.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Make sure user is mess owner
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this mess'
      });
    }

    // Don't allow changing owner
    delete req.body.owner;

    mess = await Mess.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: mess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating mess',
      error: error.message
    });
  }
};

// @desc    Delete mess
// @route   DELETE /api/messes/:id
// @access  Private (mess_manager - owner only)
exports.deleteMess = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Make sure user is mess owner
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this mess'
      });
    }

    // Soft delete - just mark as inactive
    mess.isActive = false;
    await mess.save();

    res.status(200).json({
      success: true,
      message: 'Mess deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mess',
      error: error.message
    });
  }
};

// @desc    Get my mess (for logged in mess manager)
// @route   GET /api/messes/my/mess
// @access  Private (mess_manager)
exports.getMyMess = async (req, res) => {
  try {
    const mess = await Mess.findOne({ owner: req.user.id });

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a mess registered'
      });
    }

    // Get menu
    const menu = await Menu.findOne({ mess: mess._id });

    res.status(200).json({
      success: true,
      data: {
        ...mess.toObject(),
        menu: menu ? menu.weeklyMenu : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your mess',
      error: error.message
    });
  }
};
