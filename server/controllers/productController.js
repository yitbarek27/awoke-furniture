const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.findAll();
    // Map id to _id for frontend compatibility if needed, but easier to change frontend to accept id or _id
    const productsWithId = products.map(p => {
        const json = p.toJSON();
        return { ...json, _id: json.id };
    });
    res.json(productsWithId);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (product) {
        res.json({ ...product.toJSON(), _id: product.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (product) {
        await product.destroy();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create({
        name: 'Sample Name',
        price: 0,
        imageUrl: '/images/hero.png',
        category: 'Sample Category',
        quantity: 0,
        description: 'Sample description',
    });

    res.status(201).json({ ...product.toJSON(), _id: product.id });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        imageUrl,
        category,
        quantity,
    } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        product.category = category;
        product.quantity = quantity;

        const updatedProduct = await product.save();
        res.json({ ...updatedProduct.toJSON(), _id: updatedProduct.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};
