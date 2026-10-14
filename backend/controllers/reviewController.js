const Review = require('../models/Review');
const Mess = require('../models/Mess');

// @desc    Get reviews for a mess
// @route   GET /api/reviews/mess/:messId
// @access  Public
exports.getMessReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mess: req.params.messId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (customer)
exports.createReview = async (req, res) => {
  try {
    const { messId, rating, comment } = req.body;

    if (!messId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide messId, rating, and comment'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if mess exists
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Check if user already reviewed this mess
    const existingReview = await Review.findOne({ mess: messId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this mess'
      });
    }

    // Create review
    const review = await Review.create({
      mess: messId,
      user: req.user.id,
      rating,
      comment
    });

    // Update mess rating
    const allReviews = await Review.find({ mess: messId });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
    
    await Mess.findByIdAndUpdate(messId, {
      'rating.average': avgRating.toFixed(1),
      'rating.count': allReviews.length
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (customer - owner only)
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name avatar');

    // Recalculate mess rating
    const allReviews = await Review.find({ mess: review.mess });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
    
    await Mess.findByIdAndUpdate(review.mess, {
      'rating.average': avgRating.toFixed(1),
      'rating.count': allReviews.length
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (customer - owner only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const messId = review.mess;
    await review.deleteOne();

    // Recalculate mess rating
    const allReviews = await Review.find({ mess: messId });
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
      await Mess.findByIdAndUpdate(messId, {
        'rating.average': avgRating.toFixed(1),
        'rating.count': allReviews.length
      });
    } else {
      await Mess.findByIdAndUpdate(messId, {
        'rating.average': 0,
        'rating.count': 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};
