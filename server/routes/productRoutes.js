const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, getProductBySlug } = require('../controllers/productController');
const { protect, admin, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, checkPermission('canManageProducts'), createProduct);

router.get('/category/:id', getProductsByCategory);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, checkPermission('canManageProducts'), updateProduct)
    .delete(protect, admin, checkPermission('canManageProducts'), deleteProduct);

router.get('/slug/:slug', getProductBySlug);

module.exports = router;
