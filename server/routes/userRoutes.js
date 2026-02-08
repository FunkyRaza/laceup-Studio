const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers } = require('../controllers/userController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

router.route('/')
    .get(protect, admin, checkPermission('canManageUsers'), getUsers);

module.exports = router;
