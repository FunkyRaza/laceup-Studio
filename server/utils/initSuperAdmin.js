const Admin = require('../models/Admin');

const initSuperAdmin = async () => {
    try {
        const superAdminExists = await Admin.findOne({ role: 'superadmin' });

        if (!superAdminExists) {
            await Admin.create({
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
            console.log('✅ Default SuperAdmin created successfully!');
        } else {
            console.log('ℹ️ SuperAdmin already exists.');
        }
    } catch (error) {
        console.error(`❌ Error initializing SuperAdmin: ${error.message}`);
    }
};

module.exports = initSuperAdmin;
