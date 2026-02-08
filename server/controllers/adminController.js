const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/admins/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                token: generateToken(admin._id),
            });
        } else {
            console.log(`Auth failed for ${email}: Password mismatch`);
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } else {
        console.log(`Auth failed for ${email}: Admin not found`);
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new admin (Superadmin only or first admin)
// @route   POST /api/admins
// @access  Private/SuperAdmin
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        role: role || 'admin',
        permissions: req.body.permissions || {
            canAccessAdminPanel: false,
            canManageProducts: false,
            canManageCategories: false,
            canManageOrders: false,
            canManageUsers: false
        }
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc    Get all admins (Credentials table)
// @route   GET /api/admins
// @access  Private/Admin
const getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
});

// @desc    Get dashboard stats
// @route   GET /api/admins/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await require('../models/Category').countDocuments();

    const orders = await Order.find({ status: 'Delivered' });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue
    });
});

// @desc    Update admin permissions
// @route   PUT /api/admins/:id/permissions
// @access  Private/SuperAdmin
const updateAdminPermissions = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
        admin.permissions = req.body.permissions || admin.permissions;
        const updatedAdmin = await admin.save();
        res.json({
            _id: updatedAdmin._id,
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            role: updatedAdmin.role,
            permissions: updatedAdmin.permissions,
        });
    } else {
        res.status(404);
        throw new Error('Admin not found');
    }
});

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
        if (admin.role === 'superadmin') {
            res.status(400);
            throw new Error('Cannot delete superadmin');
        }
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin removed' });
    } else {
        res.status(404);
        throw new Error('Admin not found');
    }
});

module.exports = { authAdmin, registerAdmin, getAdmins, getDashboardStats, updateAdminPermissions, deleteAdmin };
