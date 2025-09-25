const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Camera name is required'],
    trim: true,
    maxlength: [50, 'Camera name cannot exceed 50 characters']
  },
  ip: {
    type: String,
    required: [true, 'IP address is required'],
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Please enter a valid IP address']
  },
  port: {
    type: Number,
    default: 80,
    min: [1, 'Port must be between 1 and 65535'],
    max: [65535, 'Port must be between 1 and 65535']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Camera must be linked to a store']
  },
  location: {
    area: {
      type: String,
      required: [true, 'Camera area is required'],
      trim: true
    },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    }
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'error', 'maintenance'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  capabilities: {
    motionDetection: {
      type: Boolean,
      default: true
    },
    faceRecognition: {
      type: Boolean,
      default: false
    },
    objectDetection: {
      type: Boolean,
      default: true
    },
    nightVision: {
      type: Boolean,
      default: true
    }
  },
  settings: {
    resolution: {
      type: String,
      enum: ['720p', '1080p', '4K'],
      default: '1080p'
    },
    frameRate: {
      type: Number,
      default: 30,
      min: [1, 'Frame rate must be at least 1'],
      max: [60, 'Frame rate cannot exceed 60']
    },
    recordingEnabled: {
      type: Boolean,
      default: true
    },
    alertEnabled: {
      type: Boolean,
      default: true
    }
  },
  streamUrl: {
    type: String,
    trim: true
  },
  rtspUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for full stream URL
cameraSchema.virtual('fullStreamUrl').get(function() {
  if (this.streamUrl) return this.streamUrl;
  return `http://${this.ip}:${this.port}/video`;
});

// Virtual for RTSP URL
cameraSchema.virtual('fullRtspUrl').get(function() {
  if (this.rtspUrl) return this.rtspUrl;
  return `rtsp://${this.username}:${this.password}@${this.ip}:${this.port}/stream`;
});

// Index for store queries
cameraSchema.index({ storeId: 1 });
cameraSchema.index({ status: 1 });

module.exports = mongoose.model('Camera', cameraSchema);
