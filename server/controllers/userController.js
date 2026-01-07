const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    const user = await User.findOne({ where: { name } });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id, // Sequelize uses 'id' not '_id'
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Public registration ALWAYS creates a customer
    const user = await User.create({
        name,
        email,
        password,
        role: 'customer'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });

    // Map id to _id for frontend compatibility
    const usersWithId = users.map(user => ({
        ...user.toJSON(),
        _id: user.id
    }));

    res.json(usersWithId);
});

const adminCreateUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { name } });
    if (userExists) {
        res.status(400);
        throw new Error('User with this username already exists');
    }

    if (email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }
    }

    const user = await User.create({
        name,
        email: email || null,
        password,
        role: role || 'sales'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    console.log('Backend: Attempting to delete user with ID:', req.params.id);
    const user = await User.findByPk(req.params.id);

    if (user) {
        console.log('Backend: User found:', user.name, 'Role:', user.role);
        if (user.role === 'admin' && user.name === 'Awoke') {
            console.warn('Backend: Prevented deletion of main administrator');
            res.status(400);
            throw new Error('Cannot delete main administrator');
        }
        await user.destroy();
        console.log('Backend: User deleted successfully');
        res.json({ message: 'User removed' });
    } else {
        console.error('Backend: User not found with ID:', req.params.id);
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all sales users
// @route   GET /api/users/sales
// @access  Private/Sales
const getSalesUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        where: { role: 'sales' },
        attributes: { exclude: ['password'] }
    });

    // Map id to _id for frontend compatibility
    const usersWithId = users.map(user => ({
        ...user.toJSON(),
        _id: user.id
    }));

    res.json(usersWithId);
});

module.exports = {
    authUser,
    registerUser,
    getUsers,
    adminCreateUser,
    getUserProfile,
    deleteUser,
    getSalesUsers,
};
