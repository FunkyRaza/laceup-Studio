const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Unified Login for Admins and Users
// @route   POST /api/auth/login
// @access  Public
const unifiedLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Check Admin Collection first
    const admin = await Admin.findOne({ email });
    if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
            return res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                token: generateToken({
                    id: admin._id,
                    role: admin.role,
                    permissions: admin.permissions
                }),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }

    // 2. Check User Collection
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken({
                    id: user._id,
                    role: user.role
                }),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }

    // 3. Neither found
    res.status(401);
    throw new Error('Invalid email or password');
});

module.exports = { unifiedLogin };
