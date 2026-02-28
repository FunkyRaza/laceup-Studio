const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const finalCheck = async () => {
    await connectDB();
    try {
        const admins = await Admin.find({});
        console.log('\n--- Current Admins in Database ---');
        admins.forEach(a => {
            console.log(`Email: ${a.email} | Role: ${a.role} | Pwd Hash: ${a.password.substring(0, 10)}...`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

finalCheck();
