const express = require('express');
const router = express.Router();
const { unifiedLogin } = require('../controllers/authController');

// @desc    Unified Login
// @route   POST /api/auth/login
router.post('/login', unifiedLogin);

module.exports = router;
