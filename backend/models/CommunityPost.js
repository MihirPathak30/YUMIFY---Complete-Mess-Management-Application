const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  type: {
    type: String,
    enum: ['announcement', 'menu_update', 'offer', 'holiday'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
CommunityPostSchema.index({ mess: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
