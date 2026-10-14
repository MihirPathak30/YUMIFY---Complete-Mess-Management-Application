const mongoose = require('mongoose');

const MessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mess name is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: 'A great place for homely meals'
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  cuisineType: {
    type: String,
    default: 'North Indian'
  },
  priceRange: {
    min: { type: Number, default: 40 },
    max: { type: Number, default: 120 }
  },
  timing: {
    type: String,
    default: '7 AM - 10 PM'
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'
  },
  location: {
    latitude: { type: Number, default: 28.6139 },
    longitude: { type: Number, default: 77.2090 }
  },
  amenities: [{
    type: String
  }],
  specialities: [{
    type: String
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalCustomers: {
    type: Number,
    default: 0
  },
  yearsActive: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate distance (not used in current implementation but useful)
MessSchema.methods.calculateDistance = function(lat, lng) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat - this.location.latitude) * Math.PI / 180;
  const dLon = (lng - this.location.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.location.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(1) + ' km';
};

module.exports = mongoose.model('Mess', MessSchema);
