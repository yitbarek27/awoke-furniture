const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');

// Import Models for Associations
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define Associations
User.hasMany(Order);
Order.belongsTo(User);
// In Sequelize for M:N with extra fields often easier to do 1:M to OrderItems
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// Database Sync
sequelize.sync({ force: false }) // set force: true to reset DB
    .then(() => console.log('SQLite Database Connected & Synced'))
    .catch(err => console.error('Database Error:', err));


// Routes
app.get('/', (req, res) => {
    res.send('Awoke Furniture API is running');
});

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/uploads', express.static(uploadsDir));

// Serve the React production build (client/dist) as static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA fallback: return client index.html for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Not Found Middleware
app.use((req, res, next) => {
    console.log(`Backend 404: ${req.method} ${req.originalUrl}`);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
