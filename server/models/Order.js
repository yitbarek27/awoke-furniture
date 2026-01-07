const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    shippingAddress: {
        type: DataTypes.JSON, // Store address as JSON for simplicity in SQLite
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemsPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    taxPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    shippingPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    paidAt: {
        type: DataTypes.DATE
    },
    isDelivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deliveredAt: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
});

module.exports = Order;
