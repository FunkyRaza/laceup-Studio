const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await Admin.deleteMany();

        const superAdmin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: 'admin123', // Will be hashed by model pre-save hook
            role: 'superadmin',
            permissions: {
                canAccessAdminPanel: true,
                canManageProducts: true,
                canManageCategories: true,
                canManageOrders: true,
                canManageUsers: true
            }
        });

        console.log('SuperAdmin Created Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
