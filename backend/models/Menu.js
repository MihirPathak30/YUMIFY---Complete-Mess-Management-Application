const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  weeklyMenu: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    breakfast: {
      name: { type: String, default: 'Not Available' },
      price: { type: Number, default: 0 },
      available: { type: Boolean, default: true }
    },
    lunch: {
      name: { type: String, default: 'Not Available' },
      price: { type: Number, default: 0 },
      available: { type: Boolean, default: true }
    },
    dinner: {
      name: { type: String, default: 'Not Available' },
      price: { type: Number, default: 0 },
      available: { type: Boolean, default: true }
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one menu per mess
MenuSchema.index({ mess: 1 }, { unique: true });

module.exports = mongoose.model('Menu', MenuSchema);
