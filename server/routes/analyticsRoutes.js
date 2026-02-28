const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalyticsData } = require('../controllers/analyticsController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/detailed', protect, admin, getAnalyticsData);

module.exports = router;
