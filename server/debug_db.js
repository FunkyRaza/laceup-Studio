const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const checkProducts = async () => {
    try {
        const Product = require('./models/Product');
        const products = await Product.find({});
        console.log(`--- Products Found (${products.length}) ---`);
        products.forEach(p => {
            console.log(`Name: ${p.name}`);
            console.log(`Image: ${p.image}`);
            console.log(`Images: ${JSON.stringify(p.images)}`);
            console.log('---');
        });
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkProducts();
