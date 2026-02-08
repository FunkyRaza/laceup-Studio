require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes Imports
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect to Database
connectDB().then(() => {
    const initSuperAdmin = require('./utils/initSuperAdmin');
    initSuperAdmin();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // Alias
app.use('/api/admins', adminRoutes);
app.use('/api/admin', adminRoutes); // Alias
app.use('/api/categories', categoryRoutes);
app.use('/api/category', categoryRoutes); // Alias
app.use('/api/products', productRoutes);
app.use('/api/product', productRoutes); // Alias
app.use('/api/orders', orderRoutes);
app.use('/api/order', orderRoutes); // Alias

app.get('/', (req, res) => {
    res.send('Ecommerce API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
