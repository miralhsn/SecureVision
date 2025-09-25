const express = require('express');
const Camera = require('../models/Camera');
const Store = require('../models/Store');
const ActivityLog = require('../models/ActivityLog');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all cameras
// @route   GET /api/cameras
// @access  Private
const getCameras = async (req, res) => {
  try {
    const { storeId, status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    
    if (storeId) {
      query.storeId = storeId;
      
      // Check if user has access to this store
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }
      
      if (userRole !== 'admin' && store.linkedUser.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (userRole !== 'admin') {
      // Non-admin users can only see cameras from their stores
      const userStores = await Store.find({ linkedUser: userId }).select('_id');
      const storeIds = userStores.map(store => store._id);
      query.storeId = { $in: storeIds };
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const cameras = await Camera.find(query)
      .populate('storeId', 'storeName address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Camera.countDocuments(query);

    res.json({
      success: true,
      data: {
        cameras,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCameras: total
        }
      }
    });
  } catch (error) {
    console.error('Get cameras error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cameras',
      error: error.message
    });
  }
};

// @desc    Get camera by ID
// @route   GET /api/cameras/:id
// @access  Private
const getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id)
      .populate('storeId', 'storeName address');

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera not found'
      });
    }

    // Check if user has access to this camera's store
    if (req.user.role !== 'admin' && camera.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { camera }
    });
  } catch (error) {
    console.error('Get camera error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camera',
      error: error.message
    });
  }
};

// @desc    Create camera
// @route   POST /api/cameras
// @access  Private
const createCamera = async (req, res) => {
  try {
    const {
      name,
      ip,
      port,
      username,
      password,
      storeId,
      location,
      capabilities,
      settings
    } = req.body;

    // Check if user has access to this store
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (req.user.role !== 'admin' && store.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const camera = await Camera.create({
      name,
      ip,
      port,
      username,
      password,
      storeId,
      location,
      capabilities,
      settings
    });

    // Update store camera count
    await Store.findByIdAndUpdate(storeId, {
      $inc: { cameraCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Camera added successfully',
      data: { camera }
    });
  } catch (error) {
    console.error('Create camera error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add camera',
      error: error.message
    });
  }
};

// @desc    Update camera
// @route   PUT /api/cameras/:id
// @access  Private
const updateCamera = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id).populate('storeId');

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera not found'
      });
    }

    // Check if user has access to this camera's store
    if (req.user.role !== 'admin' && camera.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedCamera = await Camera.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('storeId', 'storeName address');

    res.json({
      success: true,
      message: 'Camera updated successfully',
      data: { camera: updatedCamera }
    });
  } catch (error) {
    console.error('Update camera error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update camera',
      error: error.message
    });
  }
};

// @desc    Delete camera
// @route   DELETE /api/cameras/:id
// @access  Private
const deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id).populate('storeId');

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera not found'
      });
    }

    // Check if user has access to this camera's store
    if (req.user.role !== 'admin' && camera.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete associated activity logs
    await ActivityLog.deleteMany({ cameraId: camera._id });

    // Update store camera count
    await Store.findByIdAndUpdate(camera.storeId._id, {
      $inc: { cameraCount: -1 }
    });

    await Camera.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Camera deleted successfully'
    });
  } catch (error) {
    console.error('Delete camera error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete camera',
      error: error.message
    });
  }
};

// @desc    Update camera status
// @route   PUT /api/cameras/:id/status
// @access  Private
const updateCameraStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        lastSeen: new Date()
      },
      { new: true, runValidators: true }
    ).populate('storeId', 'storeName');

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera not found'
      });
    }

    // Check if user has access to this camera's store
    if (req.user.role !== 'admin' && camera.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Log status change
    await ActivityLog.create({
      type: status === 'online' ? 'camera_online' : 'camera_offline',
      severity: status === 'offline' ? 'medium' : 'low',
      details: {
        description: `Camera ${camera.name} is now ${status}`,
        confidence: 100
      },
      storeId: camera.storeId._id,
      cameraId: camera._id
    });

    res.json({
      success: true,
      message: `Camera status updated to ${status}`,
      data: { camera }
    });
  } catch (error) {
    console.error('Update camera status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update camera status',
      error: error.message
    });
  }
};

// @desc    Get camera analytics
// @route   GET /api/cameras/:id/analytics
// @access  Private
const getCameraAnalytics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    const cameraId = req.params.id;

    const camera = await Camera.findById(cameraId).populate('storeId');
    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera not found'
      });
    }

    // Check if user has access to this camera's store
    if (req.user.role !== 'admin' && camera.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate time range
    const now = new Date();
    let startTime;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get activity logs for this camera
    const activities = await ActivityLog.find({
      cameraId,
      timestamp: { $gte: startTime }
    }).sort({ timestamp: -1 });

    const totalActivities = activities.length;
    const activitiesByType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    const activitiesBySeverity = activities.reduce((acc, activity) => {
      acc[activity.severity] = (acc[activity.severity] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        camera: {
          id: camera._id,
          name: camera.name,
          status: camera.status,
          location: camera.location,
          lastSeen: camera.lastSeen
        },
        analytics: {
          totalActivities,
          activitiesByType,
          activitiesBySeverity,
          uptime: camera.status === 'online' ? '100%' : '0%'
        },
        recentActivities: activities.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get camera analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camera analytics',
      error: error.message
    });
  }
};

// Routes
router.get('/', authenticate, getCameras);
router.get('/:id', authenticate, getCameraById);
router.get('/:id/analytics', authenticate, getCameraAnalytics);
router.post('/', authenticate, createCamera);
router.put('/:id', authenticate, updateCamera);
router.put('/:id/status', authenticate, updateCameraStatus);
router.delete('/:id', authenticate, deleteCamera);

module.exports = router;
