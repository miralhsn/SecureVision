const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const Store = require('../models/Store');
const Camera = require('../models/Camera');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const { storeId, timeRange = '24h' } = req.query;
    const userId = req.user.id;

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

    // Build query
    const query = { timestamp: { $gte: startTime } };
    if (storeId) {
      query.storeId = storeId;
    }

    // Get activity logs
    const activities = await ActivityLog.find(query)
      .populate('storeId', 'storeName')
      .populate('cameraId', 'name location')
      .sort({ timestamp: -1 });

    // Calculate metrics
    const totalAlerts = activities.length;
    const criticalAlerts = activities.filter(a => a.severity === 'critical').length;
    const resolvedAlerts = activities.filter(a => a.isResolved).length;
    
    // Group by type
    const alertsByType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    // Group by hour for timeline
    const timelineData = activities.reduce((acc, activity) => {
      const hour = new Date(activity.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    // Convert to array for chart
    const timelineArray = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      incidents: timelineData[i] || 0
    }));

    // Get camera status
    const cameras = await Camera.find(storeId ? { storeId } : {});
    const activeCameras = cameras.filter(c => c.status === 'online').length;
    const offlineCameras = cameras.filter(c => c.status === 'offline').length;

    res.json({
      success: true,
      data: {
        overview: {
          totalAlerts,
          criticalAlerts,
          resolvedAlerts,
          activeCameras,
          offlineCameras,
          resolutionRate: totalAlerts > 0 ? (resolvedAlerts / totalAlerts * 100).toFixed(1) : 0
        },
        alertsByType,
        timeline: timelineArray,
        recentActivities: activities.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
};

// @desc    Get shrinkage analytics
// @route   GET /api/analytics/shrinkage
// @access  Public
const getShrinkageAnalytics = async (req, res) => {
  try {
    // Mock shrinkage data for different countries
    const shrinkageData = [
      { name: "United States", coordinates: [-100, 40], shrinkage: "2.0%" },
      { name: "Brazil", coordinates: [-51, -10], shrinkage: "1.7%" },
      { name: "South Africa", coordinates: [24, -29], shrinkage: "2.3%" },
      { name: "India", coordinates: [78, 21], shrinkage: "1.9%" },
      { name: "China", coordinates: [104, 35], shrinkage: "2.4%" },
      { name: "UK", coordinates: [-2, 55], shrinkage: "1.6%" },
      { name: "Australia", coordinates: [133, -25], shrinkage: "1.8%" },
      { name: "Germany", coordinates: [10, 51], shrinkage: "1.5%" },
      { name: "Japan", coordinates: [138, 36], shrinkage: "1.2%" },
      { name: "Canada", coordinates: [-106, 56], shrinkage: "1.8%" }
    ];

    // Calculate global statistics
    const globalStats = {
      totalLoss: 132000000000, // $132 billion
      averageShrinkage: 1.82,
      totalCountries: shrinkageData.length,
      highestShrinkage: Math.max(...shrinkageData.map(d => parseFloat(d.shrinkage)))
    };

    res.json({
      success: true,
      data: {
        globalStats,
        countryData: shrinkageData
      }
    });
  } catch (error) {
    console.error('Shrinkage analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shrinkage analytics',
      error: error.message
    });
  }
};

// @desc    Get incident trends
// @route   GET /api/analytics/trends
// @access  Private
const getIncidentTrends = async (req, res) => {
  try {
    const { storeId, days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = { 
      timestamp: { $gte: startDate },
      type: { $in: ['motion_detected', 'person_detected', 'loitering', 'theft_suspected'] }
    };
    
    if (storeId) {
      query.storeId = storeId;
    }

    const activities = await ActivityLog.find(query).sort({ timestamp: 1 });

    // Group by date
    const trends = activities.reduce((acc, activity) => {
      const date = activity.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, incidents: 0, types: {} };
      }
      acc[date].incidents++;
      acc[date].types[activity.type] = (acc[date].types[activity.type] || 0) + 1;
      return acc;
    }, {});

    const trendsArray = Object.values(trends);

    res.json({
      success: true,
      data: {
        trends: trendsArray,
        totalIncidents: activities.length,
        averagePerDay: trendsArray.length > 0 ? (activities.length / trendsArray.length).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Incident trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incident trends',
      error: error.message
    });
  }
};

// @desc    Get crowd flow analytics
// @route   GET /api/analytics/crowd-flow
// @access  Private
const getCrowdFlowAnalytics = async (req, res) => {
  try {
    const { storeId, timeRange = '24h' } = req.query;
    
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

    const query = { 
      timestamp: { $gte: startTime },
      type: 'crowd_density'
    };
    
    if (storeId) {
      query.storeId = storeId;
    }

    const activities = await ActivityLog.find(query).sort({ timestamp: 1 });

    // Process crowd density data
    const crowdData = activities.map(activity => ({
      timestamp: activity.timestamp,
      density: activity.details.metadata?.density || 0,
      area: activity.location?.area || 'Unknown'
    }));

    // Calculate peak hours
    const hourlyData = {};
    activities.forEach(activity => {
      const hour = new Date(activity.timestamp).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { count: 0, totalDensity: 0 };
      }
      hourlyData[hour].count++;
      hourlyData[hour].totalDensity += activity.details.metadata?.density || 0;
    });

    const peakHours = Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        averageDensity: data.totalDensity / data.count,
        count: data.count
      }))
      .sort((a, b) => b.averageDensity - a.averageDensity)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        crowdFlow: crowdData,
        peakHours,
        averageDensity: crowdData.length > 0 
          ? (crowdData.reduce((sum, d) => sum + d.density, 0) / crowdData.length).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('Crowd flow analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crowd flow analytics',
      error: error.message
    });
  }
};

// Routes
router.get('/dashboard', authenticate, getDashboardAnalytics);
router.get('/shrinkage', getShrinkageAnalytics);
router.get('/trends', authenticate, getIncidentTrends);
router.get('/crowd-flow', authenticate, getCrowdFlowAnalytics);

module.exports = router;
