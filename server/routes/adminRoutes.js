const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, getAdmins, getDashboardStats, updateAdminPermissions, deleteAdmin } = require('../controllers/adminController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.route('/')
    .post(protect, superAdmin, registerAdmin)
    .get(protect, admin, getAdmins);

router.route('/:id')
    .delete(protect, superAdmin, deleteAdmin);

router.route('/:id/permissions')
    .put(protect, superAdmin, updateAdminPermissions);

router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
