const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

router.route('/')
    .get(protect, admin, checkPermission('canManageUsers'), getUsers);

router.route('/:id')
    .put(protect, admin, checkPermission('canManageUsers'), updateUser)
    .delete(protect, admin, checkPermission('canManageUsers'), deleteUser);

module.exports = router;
