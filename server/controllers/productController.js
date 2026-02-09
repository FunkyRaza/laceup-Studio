const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name, description, price, oldPrice, stock, brand, subCategory,
        hsnCode, quality, gender, image, images, video, category,
        featured, isActive, tags, metaTitle, metaKeywords, metaDescription
    } = req.body;

    const product = new Product({
        name, description, price, oldPrice, stock, brand, subCategory,
        hsnCode, quality, gender, image, images, video, category,
        featured, isActive, tags, metaTitle, metaKeywords, metaDescription,
        createdBy: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const fields = [
            'name', 'description', 'price', 'oldPrice', 'stock', 'brand',
            'subCategory', 'hsnCode', 'quality', 'gender', 'image', 'images',
            'video', 'category', 'featured', 'isActive', 'tags',
            'metaTitle', 'metaKeywords', 'metaDescription'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get products by category
// @route   GET /api/products/category/:id
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.id }).populate('category', 'name');
    res.json(products);
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory };
