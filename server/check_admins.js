const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const checkAllAdmins = async () => {
    await connectDB();
    try {
        const admins = await Admin.find({});
        console.log(`\n--- Total Admins Found: ${admins.length} ---`);

        for (const admin of admins) {
            console.log(`\nID: ${admin._id}`);
            console.log(`Name: ${admin.name}`);
            console.log(`Email: ${admin.email}`);
            console.log(`Role: ${admin.role}`);
            console.log(`Password Hash: ${admin.password}`);

            const isMatch = await bcrypt.compare('Super@123', admin.password);
            console.log(`Matches 'Super@123'? ${isMatch}`);

            const isMatchOld = await bcrypt.compare('admin123', admin.password);
            console.log(`Matches 'admin123'? ${isMatchOld}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkAllAdmins();
