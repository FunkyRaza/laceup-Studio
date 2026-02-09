const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const resetAndSeed = async () => {
    await connectDB();
    try {
        console.log('🗑️ Deleting all existing admins...');
        await Admin.deleteMany({});

        console.log('🌱 Creating official SuperAdmin...');
        const superAdmin = await Admin.create({
            name: 'Super Admin',
            email: 'superadmin@laceup.com',
            password: 'Super@123',
            role: 'superadmin',
            permissions: {
                canAccessAdminPanel: true,
                canManageProducts: true,
                canManageCategories: true,
                canManageOrders: true,
                canManageUsers: true
            }
        });

        console.log('✅ SuperAdmin Reset & Created Successfully!');
        console.log(`Email: ${superAdmin.email}`);
        console.log(`Password: Super@123 (Hashed: ${superAdmin.password})`);

        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

resetAndSeed();
