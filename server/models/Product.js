const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    brand: { type: String },
    subCategory: { type: String },
    hsnCode: { type: String },
    quality: { type: String },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
    image: { type: String, required: true }, // Main image
    images: [{ type: String }], // Additional images
    video: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    metaTitle: { type: String },
    metaKeywords: { type: String },
    metaDescription: { type: String },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
