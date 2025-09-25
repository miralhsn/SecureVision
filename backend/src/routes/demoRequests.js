const express = require('express');
const DemoRequest = require('../models/DemoRequest');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create demo request
// @route   POST /api/demo-requests
// @access  Public
const createDemoRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      message,
      camerasNeeded,
      industry,
      storeSize,
      budget,
      timeline,
      source
    } = req.body;

    // Check if email already has a pending request
    const existingRequest = await DemoRequest.findOne({
      email,
      status: { $in: ['pending', 'contacted', 'scheduled'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending demo request. We will contact you soon.'
      });
    }

    const demoRequest = await DemoRequest.create({
      name,
      email,
      company,
      message,
      camerasNeeded,
      industry,
      storeSize,
      budget,
      timeline,
      source
    });

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully. We will contact you within 24 hours.',
      data: {
        requestId: demoRequest._id,
        status: demoRequest.status
      }
    });
  } catch (error) {
    console.error('Create demo request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit demo request',
      error: error.message
    });
  }
};

// @desc    Get all demo requests
// @route   GET /api/demo-requests
// @access  Private (Admin/Manager)
const getDemoRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const demoRequests = await DemoRequest.find(query)
      .populate('assignedTo', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DemoRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        demoRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRequests: total,
          hasNext: skip + demoRequests.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get demo requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch demo requests',
      error: error.message
    });
  }
};

// @desc    Get demo request by ID
// @route   GET /api/demo-requests/:id
// @access  Private (Admin/Manager)
const getDemoRequestById = async (req, res) => {
  try {
    const demoRequest = await DemoRequest.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found'
      });
    }

    res.json({
      success: true,
      data: { demoRequest }
    });
  } catch (error) {
    console.error('Get demo request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch demo request',
      error: error.message
    });
  }
};

// @desc    Update demo request status
// @route   PUT /api/demo-requests/:id/status
// @access  Private (Admin/Manager)
const updateDemoRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const userId = req.user.id;

    const demoRequest = await DemoRequest.findById(req.params.id);
    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found'
      });
    }

    const updateData = { status };
    
    if (status === 'contacted') {
      updateData.contactAttempts = (demoRequest.contactAttempts || 0) + 1;
      updateData.lastContactAttempt = new Date();
    }

    if (status === 'scheduled' && req.body.scheduledDemo) {
      updateData.scheduledDemo = new Date(req.body.scheduledDemo);
    }

    if (status === 'completed') {
      updateData.resolvedAt = new Date();
    }

    if (notes) {
      updateData.notes = [
        ...(demoRequest.notes || []),
        {
          note: notes,
          addedBy: userId,
          addedAt: new Date()
        }
      ];
    }

    const updatedRequest = await DemoRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Demo request status updated successfully',
      data: { demoRequest: updatedRequest }
    });
  } catch (error) {
    console.error('Update demo request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update demo request status',
      error: error.message
    });
  }
};

// @desc    Assign demo request
// @route   PUT /api/demo-requests/:id/assign
// @access  Private (Admin/Manager)
const assignDemoRequest = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const demoRequest = await DemoRequest.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found'
      });
    }

    res.json({
      success: true,
      message: 'Demo request assigned successfully',
      data: { demoRequest }
    });
  } catch (error) {
    console.error('Assign demo request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign demo request',
      error: error.message
    });
  }
};

// @desc    Get demo request statistics
// @route   GET /api/demo-requests/stats
// @access  Private (Admin/Manager)
const getDemoRequestStats = async (req, res) => {
  try {
    const stats = await DemoRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const totalRequests = await DemoRequest.countDocuments();
    const recentRequests = await DemoRequest.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalRequests,
        recentRequests,
        statusCounts,
        conversionRate: totalRequests > 0 
          ? ((statusCounts.completed || 0) / totalRequests * 100).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    console.error('Get demo request stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch demo request statistics',
      error: error.message
    });
  }
};

// Routes
router.post('/', createDemoRequest);
router.get('/', authenticate, authorize('admin', 'manager'), getDemoRequests);
router.get('/stats', authenticate, authorize('admin', 'manager'), getDemoRequestStats);
router.get('/:id', authenticate, authorize('admin', 'manager'), getDemoRequestById);
router.put('/:id/status', authenticate, authorize('admin', 'manager'), updateDemoRequestStatus);
router.put('/:id/assign', authenticate, authorize('admin', 'manager'), assignDemoRequest);

module.exports = router;
