const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, admin, checkPermission('canManageCategories'), createCategory);

router.route('/:id')
    .put(protect, admin, checkPermission('canManageCategories'), updateCategory)
    .delete(protect, admin, checkPermission('canManageCategories'), deleteCategory);

module.exports = router;
