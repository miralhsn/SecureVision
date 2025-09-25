const express = require('express');
const Store = require('../models/Store');
const Camera = require('../models/Camera');
const ActivityLog = require('../models/ActivityLog');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
const getStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    
    // Non-admin users can only see their own stores
    if (userRole !== 'admin') {
      query.linkedUser = userId;
    }
    
    if (search) {
      query.$or = [
        { storeName: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const stores = await Store.find(query)
      .populate('linkedUser', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      data: {
        stores,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalStores: total
        }
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
};

// @desc    Get store by ID
// @route   GET /api/stores/:id
// @access  Private
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('linkedUser', 'name email')
      .populate('cameras', 'name status location');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user has access to this store
    if (req.user.role !== 'admin' && store.linkedUser._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { store }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error.message
    });
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private
const createStore = async (req, res) => {
  try {
    const {
      storeName,
      address,
      coordinates,
      settings
    } = req.body;

    const store = await Store.create({
      storeName,
      address,
      coordinates,
      settings,
      linkedUser: req.user.id
    });

    // Add store to user's stores array
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { stores: store._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error.message
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private
const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user has access to this store
    if (req.user.role !== 'admin' && store.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('linkedUser', 'name email');

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: { store: updatedStore }
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store',
      error: error.message
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user has access to this store
    if (req.user.role !== 'admin' && store.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete associated cameras and activity logs
    await Camera.deleteMany({ storeId: store._id });
    await ActivityLog.deleteMany({ storeId: store._id });

    // Remove store from user's stores array
    await User.findByIdAndUpdate(
      store.linkedUser,
      { $pull: { stores: store._id } }
    );

    await Store.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store',
      error: error.message
    });
  }
};

// @desc    Get store analytics
// @route   GET /api/stores/:id/analytics
// @access  Private
const getStoreAnalytics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    const storeId = req.params.id;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user has access to this store
    if (req.user.role !== 'admin' && store.linkedUser.toString() !== req.user.id) {
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
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get cameras
    const cameras = await Camera.find({ storeId });
    const activeCameras = cameras.filter(c => c.status === 'online').length;

    // Get activity logs
    const activities = await ActivityLog.find({
      storeId,
      timestamp: { $gte: startTime }
    }).sort({ timestamp: -1 });

    const totalAlerts = activities.length;
    const criticalAlerts = activities.filter(a => a.severity === 'critical').length;
    const resolvedAlerts = activities.filter(a => a.isResolved).length;

    // Group by type
    const alertsByType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        store: {
          id: store._id,
          name: store.storeName,
          address: store.fullAddress,
          cameraCount: store.cameraCount,
          activeCameras
        },
        analytics: {
          totalAlerts,
          criticalAlerts,
          resolvedAlerts,
          resolutionRate: totalAlerts > 0 ? (resolvedAlerts / totalAlerts * 100).toFixed(1) : 0,
          alertsByType
        },
        recentActivities: activities.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get store analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store analytics',
      error: error.message
    });
  }
};

// Routes
router.get('/', authenticate, getStores);
router.get('/:id', authenticate, getStoreById);
router.get('/:id/analytics', authenticate, getStoreAnalytics);
router.post('/', authenticate, createStore);
router.put('/:id', authenticate, updateStore);
router.delete('/:id', authenticate, deleteStore);

module.exports = router;
