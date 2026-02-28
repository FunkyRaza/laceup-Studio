const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // Get basic counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get pending shipments (pending + processing orders)
    const pendingShipments = await Order.countDocuments({
        status: { $in: ['pending', 'processing'] }
    });

    // Get low stock items (stock < 10)
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });

    // Get sales timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTimeline = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$total' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: { $dateToString: { format: '%b %d', date: { $dateFromString: { dateString: '$_id' } } } },
                revenue: 1,
                orders: 1
            }
        }
    ]);

    // Get product category distribution
    const categoryDistribution = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$categoryInfo.name',
                value: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                name: { $ifNull: ['$_id', 'Uncategorized'] },
                value: 1
            }
        }
    ]);

    // Assign colors to categories
    const colors = ['#3b82f6', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];
    const productCategories = categoryDistribution.map((cat, index) => ({
        ...cat,
        color: colors[index % colors.length]
    }));

    res.json({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        pendingShipments,
        lowStock,
        salesTimeline,
        productCategories
    });
});

// @desc    Get detailed analytics
// @route   GET /api/analytics/detailed
// @access  Private/Admin
const getAnalyticsData = asyncHandler(async (req, res) => {
    // Get basic counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get monthly revenue and orders (last 7 months)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    const monthlyData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                revenue: { $sum: '$total' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = monthlyData.map(item => ({
        name: monthNames[item._id.month - 1],
        revenue: item.revenue
    }));

    const monthlyOrders = monthlyData.map(item => ({
        name: monthNames[item._id.month - 1],
        orders: item.orders
    }));

    // Get category performance
    const categoryPerformance = await Order.aggregate([
        { $unwind: '$items' },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'categories',
                localField: 'productInfo.category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$categoryInfo.name',
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                orders: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                name: { $ifNull: ['$_id', 'Uncategorized'] },
                revenue: 1,
                orders: 1
            }
        }
    ]);

    // Calculate growth percentages (compare last month vs previous month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const lastMonthRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: lastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const previousMonthRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: twoMonthsAgo, $lt: lastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const lastMonthRev = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;
    const prevMonthRev = previousMonthRevenue.length > 0 ? previousMonthRevenue[0].total : 1;
    const revenueGrowth = ((lastMonthRev - prevMonthRev) / prevMonthRev * 100).toFixed(1);

    res.json({
        totalRevenue,
        totalOrders,
        totalCustomers: totalUsers,
        totalProducts,
        revenueGrowth: parseFloat(revenueGrowth),
        monthlyRevenue,
        monthlyOrders,
        categoryPerformance
    });
});

module.exports = { getDashboardStats, getAnalyticsData };
