const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = await Order.create({
            UserId: req.user.id,
            shippingAddress: shippingAddress, // Will be stringified JSON
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // Create Order Items and Decrement Stock
        for (const item of orderItems) {
            await OrderItem.create({
                OrderId: order.id,
                name: item.name,
                qty: item.qty,
                price: item.price,
                image: item.image,
                productId: item.product, // Storing original product ID
            });

            // Decrement Stock
            const product = await Product.findByPk(item.product);
            if (product) {
                product.quantity = product.quantity - item.qty;
                await product.save();
            }
        }

        // Fetch complete order with items
        const fullOrder = await Order.findByPk(order.id, {
            include: [OrderItem]
        });

        res.status(201).json({ ...fullOrder.toJSON(), _id: fullOrder.id });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: User, attributes: ['name', 'email'] },
            { model: OrderItem }
        ]
    });

    if (order) {
        // Transform OrderItems to match frontend expectation of 'orderItems' array
        const jsonOrder = order.toJSON();
        jsonOrder.orderItems = jsonOrder.OrderItems.map(item => ({ ...item, product: item.productId })); // map back for frontend compatibility
        jsonOrder._id = jsonOrder.id;

        res.json(jsonOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.findAll({
        where: { UserId: req.user.id }
    });
    res.json(orders.map(o => ({ ...o.toJSON(), _id: o.id })));
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.findAll({
        include: [{ model: User, attributes: ['id', 'name'] }]
    });
    res.json(orders.map(o => ({ ...o.toJSON(), _id: o.id })));
});

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
};
