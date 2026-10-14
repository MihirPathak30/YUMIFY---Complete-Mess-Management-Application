const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  orderDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'cash', 'upi', 'card'],
    required: true
  },
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ mess: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', OrderSchema);
