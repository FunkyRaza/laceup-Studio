const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const checkAdmin = async () => {
    try {
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('--- Admin Found ---');
            console.log(`ID: ${admin._id}`);
            console.log(`Email: ${admin.email}`);
            console.log(`Role: ${admin.role}`);
            console.log(`Password Hash: ${admin.password}`);
            console.log(`Permissions: ${JSON.stringify(admin.permissions, null, 2)}`);

            // Test hash comparison
            const bcrypt = require('bcryptjs');
            const match = await bcrypt.compare('admin123', admin.password);
            console.log(`Password 'admin123' match: ${match}`);
        } else {
            console.log('Admin NOT found in database.');
        }
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkAdmin();
