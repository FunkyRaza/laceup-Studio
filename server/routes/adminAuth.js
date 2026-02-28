const express = require('express');
const router = express.Router();
const { authAdmin, getAdminProfile } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
router.post('/login', authAdmin);

// @desc    Get logged-in admin profile
// @route   GET /api/admin/me
router.get('/me', protect, admin, getAdminProfile);

// @desc    Logout admin
// @route   POST /api/admin/logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
