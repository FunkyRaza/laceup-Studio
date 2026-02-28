const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    permissions: {
        canAccessAdminPanel: { type: Boolean, default: false },
        canManageProducts: { type: Boolean, default: false },
        canManageCategories: { type: Boolean, default: false },
        canManageOrders: { type: Boolean, default: false },
        canManageUsers: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
