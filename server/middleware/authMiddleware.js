const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const tokenPayloadId = decoded.id || decoded.adminId;

            // Try to find in User or Admin collection
            req.user = await User.findById(tokenPayloadId).select('-password') ||
                await Admin.findById(tokenPayloadId).select('-password');

            next();
        } catch (error) {
            console.error('--- [AUTH MIDDLEWARE ERROR] ---');
            console.error('Error details:', error.message);
            console.error('Token:', token ? token.substring(0, 20) + '...' : 'none');
            console.error('Stack:', error.stack);
            console.error('--------------------------------');
            res.status(401);
            throw new Error('Not authorized, token failed: ' + error.message);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a super admin');
    }
};

const checkPermission = (permission) => {
    return (req, res, next) => {
        if (req.user && req.user.role === 'superadmin') {
            return next();
        }
        if (req.user && req.user.role === 'admin' && req.user.permissions && req.user.permissions[permission]) {
            return next();
        }
        res.status(403);
        throw new Error(`Permission Denied: ${permission} access required`);
    };
};

module.exports = { protect, admin, superAdmin, checkPermission };
