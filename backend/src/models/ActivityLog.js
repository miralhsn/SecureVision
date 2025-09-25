const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'motion_detected',
      'person_detected',
      'object_left',
      'loitering',
      'crowd_density',
      'violence_detected',
      'intrusion',
      'theft_suspected',
      'camera_offline',
      'camera_online',
      'system_alert',
      'user_login',
      'user_logout',
      'settings_changed'
    ]
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  details: {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    boundingBox: {
      x: { type: Number },
      y: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Activity must be linked to a store']
  },
  cameraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    area: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ storeId: 1, timestamp: -1 });
activityLogSchema.index({ type: 1, timestamp: -1 });
activityLogSchema.index({ severity: 1, timestamp: -1 });
activityLogSchema.index({ isResolved: 1, timestamp: -1 });

// Virtual for time ago
activityLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.timestamp) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
