const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'US',
      trim: true
    }
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  cameraCount: {
    type: Number,
    default: 0,
    min: [0, 'Camera count cannot be negative']
  },
  linkedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Store must be linked to a user']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    businessHours: {
      open: {
        type: String,
        default: '09:00'
      },
      close: {
        type: String,
        default: '21:00'
      }
    },
    alertThresholds: {
      loitering: {
        type: Number,
        default: 30 // seconds
      },
      crowdDensity: {
        type: Number,
        default: 0.8 // 80% capacity
      }
    }
  },
  metrics: {
    totalAlerts: {
      type: Number,
      default: 0
    },
    lastAlert: {
      type: Date
    },
    averageFootfall: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Virtual for full address
storeSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Index for geospatial queries
storeSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
