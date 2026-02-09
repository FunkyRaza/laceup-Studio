const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, checkPermission('canManageOrders'), getOrders);

router.get('/myorders', protect, getMyOrders);
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, checkPermission('canManageOrders'), deleteOrder);

router.put('/:id/status', protect, admin, checkPermission('canManageOrders'), updateOrderStatus);

module.exports = router;
