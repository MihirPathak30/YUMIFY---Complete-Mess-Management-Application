const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per user per mess
ReviewSchema.index({ mess: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
