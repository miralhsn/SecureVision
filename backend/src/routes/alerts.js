const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const Store = require('../models/Store');
const Camera = require('../models/Camera');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const { 
      storeId, 
      type, 
      severity, 
      isResolved, 
      page = 1, 
      limit = 20,
      timeRange = '24h'
    } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

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

    let query = { timestamp: { $gte: startTime } };
    
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
      // Non-admin users can only see alerts from their stores
      const userStores = await Store.find({ linkedUser: userId }).select('_id');
      const storeIds = userStores.map(store => store._id);
      query.storeId = { $in: storeIds };
    }
    
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const alerts = await ActivityLog.find(query)
      .populate('storeId', 'storeName address')
      .populate('cameraId', 'name location')
      .populate('userId', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalAlerts: total
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
};

// @desc    Get alert by ID
// @route   GET /api/alerts/:id
// @access  Private
const getAlertById = async (req, res) => {
  try {
    const alert = await ActivityLog.findById(req.params.id)
      .populate('storeId', 'storeName address')
      .populate('cameraId', 'name location')
      .populate('userId', 'name email')
      .populate('resolvedBy', 'name email');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user has access to this alert's store
    if (req.user.role !== 'admin' && alert.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert',
      error: error.message
    });
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
const resolveAlert = async (req, res) => {
  try {
    const { notes } = req.body;

    const alert = await ActivityLog.findById(req.params.id).populate('storeId');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user has access to this alert's store
    if (req.user.role !== 'admin' && alert.storeId.linkedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (alert.isResolved) {
      return res.status(400).json({
        success: false,
        message: 'Alert is already resolved'
      });
    }

    const updatedAlert = await ActivityLog.findByIdAndUpdate(
      req.params.id,
      {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user.id,
        ...(notes && { 
          $push: { 
            tags: `Resolved: ${notes}` 
          } 
        })
      },
      { new: true, runValidators: true }
    ).populate('resolvedBy', 'name email');

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: { alert: updatedAlert }
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message
    });
  }
};

// @desc    Create alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const {
      type,
      severity,
      details,
      storeId,
      cameraId,
      location,
      imageUrl,
      videoUrl
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

    const alert = await ActivityLog.create({
      type,
      severity,
      details,
      storeId,
      cameraId,
      location,
      imageUrl,
      videoUrl,
      userId: req.user.id
    });

    // Emit real-time alert via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`store-${storeId}`).emit('new-alert', {
        alert: await ActivityLog.findById(alert._id)
          .populate('storeId', 'storeName')
          .populate('cameraId', 'name location')
      });
    }

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: { alert }
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alert',
      error: error.message
    });
  }
};

// @desc    Get alert statistics
// @route   GET /api/alerts/stats
// @access  Private
const getAlertStats = async (req, res) => {
  try {
    const { storeId, timeRange = '24h' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

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

    let query = { timestamp: { $gte: startTime } };
    
    if (storeId) {
      query.storeId = storeId;
    } else if (userRole !== 'admin') {
      const userStores = await Store.find({ linkedUser: userId }).select('_id');
      const storeIds = userStores.map(store => store._id);
      query.storeId = { $in: storeIds };
    }

    const totalAlerts = await ActivityLog.countDocuments(query);
    const resolvedAlerts = await ActivityLog.countDocuments({ ...query, isResolved: true });
    const criticalAlerts = await ActivityLog.countDocuments({ ...query, severity: 'critical' });

    // Group by type
    const alertsByType = await ActivityLog.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Group by severity
    const alertsBySeverity = await ActivityLog.aggregate([
      { $match: query },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Group by hour for timeline
    const timelineData = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const timeline = Array.from({ length: 24 }, (_, i) => {
      const hourData = timelineData.find(d => d._id === i);
      return {
        hour: `${i}:00`,
        alerts: hourData ? hourData.count : 0
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalAlerts,
          resolvedAlerts,
          criticalAlerts,
          resolutionRate: totalAlerts > 0 ? (resolvedAlerts / totalAlerts * 100).toFixed(1) : 0
        },
        alertsByType: alertsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        alertsBySeverity: alertsBySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        timeline
      }
    });
  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert statistics',
      error: error.message
    });
  }
};

// Routes
router.get('/', authenticate, getAlerts);
router.get('/stats', authenticate, getAlertStats);
router.get('/:id', authenticate, getAlertById);
router.post('/', authenticate, createAlert);
router.put('/:id/resolve', authenticate, resolveAlert);

module.exports = router;
