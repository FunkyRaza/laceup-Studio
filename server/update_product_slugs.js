const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Helper function to generate slug from name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const updateProductSlugs = async () => {
    try {
        console.log('Updating product slugs...');
        
        // Find all products without slugs
        const products = await Product.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] });
        
        console.log(`Found ${products.length} products without slugs`);
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const newSlug = generateSlug(product.name);
            
            // Check if the slug already exists for another product
            let uniqueSlug = newSlug;
            let counter = 1;
            let existingProduct = await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } });
            while (existingProduct) {
                uniqueSlug = `${newSlug}-${counter}`;
                counter++;
                existingProduct = await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } });
            }
            
            await Product.findByIdAndUpdate(product._id, { slug: uniqueSlug });
            console.log(`Updated product "${product.name}" with slug: ${uniqueSlug}`);
        }
        
        console.log('All products updated successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

updateProductSlugs();