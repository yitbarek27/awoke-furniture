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
async function repairSqliteOrdersUserForeignKey() {
    try {
        if (sequelize.getDialect() !== 'sqlite') return;

        const [fkRows] = await sequelize.query("PRAGMA foreign_key_list('Orders')");
        const fkList = Array.isArray(fkRows) ? fkRows : fkRows ? [fkRows] : [];
        const hasBrokenFk = fkList.some((r) => r.table === 'Users_old');
        if (!hasBrokenFk) return;

        console.warn('Detected broken foreign key: Orders.UserId -> Users_old. Repairing SQLite schema...');

        await sequelize.query('PRAGMA foreign_keys=OFF');
        await sequelize.query('BEGIN TRANSACTION');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "Orders_new" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "shippingAddress" JSON NOT NULL,
                "paymentMethod" VARCHAR(255) NOT NULL,
                "paymentScreenshotUrl" VARCHAR(255),
                "itemsPrice" FLOAT DEFAULT '0',
                "taxPrice" FLOAT DEFAULT '0',
                "shippingPrice" FLOAT DEFAULT '0',
                "totalPrice" FLOAT DEFAULT '0',
                "isPaid" TINYINT(1) DEFAULT 0,
                "paidAt" DATETIME,
                "isDelivered" TINYINT(1) DEFAULT 0,
                "deliveredAt" DATETIME,
                "status" VARCHAR(255) DEFAULT 'Pending',
                "createdAt" DATETIME NOT NULL,
                "updatedAt" DATETIME NOT NULL,
                "UserId" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
            );
        `);

        await sequelize.query(`
            INSERT INTO "Orders_new" (
                "id",
                "shippingAddress",
                "paymentMethod",
                "paymentScreenshotUrl",
                "itemsPrice",
                "taxPrice",
                "shippingPrice",
                "totalPrice",
                "isPaid",
                "paidAt",
                "isDelivered",
                "deliveredAt",
                "status",
                "createdAt",
                "updatedAt",
                "UserId"
            )
            SELECT
                "id",
                "shippingAddress",
                "paymentMethod",
                NULL as "paymentScreenshotUrl",
                "itemsPrice",
                "taxPrice",
                "shippingPrice",
                "totalPrice",
                "isPaid",
                "paidAt",
                "isDelivered",
                "deliveredAt",
                "status",
                "createdAt",
                "updatedAt",
                "UserId"
            FROM "Orders";
        `);

        await sequelize.query('DROP TABLE "Orders"');
        await sequelize.query('ALTER TABLE "Orders_new" RENAME TO "Orders"');

        await sequelize.query('COMMIT');
        await sequelize.query('PRAGMA foreign_keys=ON');

        console.warn('SQLite schema repair complete.');
    } catch (err) {
        try {
            await sequelize.query('ROLLBACK');
        } catch {
            // ignore
        }
        try {
            await sequelize.query('PRAGMA foreign_keys=ON');
        } catch {
            // ignore
        }
        console.error('SQLite schema repair failed:', err);
        throw err;
    }
}

async function initDatabase() {
    await sequelize.authenticate();
    await repairSqliteOrdersUserForeignKey();
    await sequelize.sync({ force: false }); // set force: true to reset DB
    console.log('SQLite Database Connected & Synced');
}


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

// Start Server (only after DB is ready)
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database Error:', err);
        process.exit(1);
    });
