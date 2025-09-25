const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  camerasNeeded: {
    type: Number,
    required: [true, 'Number of cameras needed is required'],
    min: [1, 'At least 1 camera is required'],
    max: [1000, 'Maximum 1000 cameras allowed']
  },
  industry: {
    type: String,
    enum: ['retail', 'warehouse', 'office', 'hospitality', 'healthcare', 'education', 'other'],
    default: 'retail'
  },
  storeSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    default: 'medium'
  },
  budget: {
    type: String,
    enum: ['under-10k', '10k-50k', '50k-100k', '100k-500k', '500k-plus'],
    default: '10k-50k'
  },
  timeline: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', '6-12-months', 'flexible'],
    default: '1-3-months'
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  contactAttempts: {
    type: Number,
    default: 0
  },
  lastContactAttempt: {
    type: Date
  },
  scheduledDemo: {
    type: Date
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'advertisement', 'trade-show', 'other'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for efficient querying
demoRequestSchema.index({ status: 1, createdAt: -1 });
demoRequestSchema.index({ email: 1 });
demoRequestSchema.index({ company: 1 });

module.exports = mongoose.model('DemoRequest', demoRequestSchema);
