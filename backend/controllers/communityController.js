const CommunityPost = require('../models/CommunityPost');
const Mess = require('../models/Mess');

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const { limit = 50, type } = req.query;

    let query = {};
    if (type) {
      query.type = type;
    }

    const posts = await CommunityPost.find(query)
      .populate('mess', 'name image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching community posts',
      error: error.message
    });
  }
};

// @desc    Get posts by mess
// @route   GET /api/community/mess/:messId
// @access  Public
exports.getPostsByMess = async (req, res) => {
  try {
    const posts = await CommunityPost.find({ mess: req.params.messId })
      .populate('mess', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mess posts',
      error: error.message
    });
  }
};

// @desc    Create community post
// @route   POST /api/community
// @access  Private (mess_manager)
exports.createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and type'
      });
    }

    // Get mess owned by this manager
    const mess = await Mess.findOne({ owner: req.user.id });

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a mess registered'
      });
    }

    const post = await CommunityPost.create({
      mess: mess._id,
      type,
      title,
      content
    });

    await post.populate('mess', 'name image');

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// @desc    Update community post
// @route   PUT /api/community/:id
// @access  Private (mess_manager - owner only)
exports.updatePost = async (req, res) => {
  try {
    let post = await CommunityPost.findById(req.params.id).populate('mess');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Verify ownership
    const mess = await Mess.findById(post.mess._id);
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await CommunityPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('mess', 'name image');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// @desc    Delete community post
// @route   DELETE /api/community/:id
// @access  Private (mess_manager - owner only)
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate('mess');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Verify ownership
    const mess = await Mess.findById(post.mess._id);
    if (mess.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};
