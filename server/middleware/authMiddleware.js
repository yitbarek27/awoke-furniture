const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Backend: protect middleware - token found');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Backend: protect middleware - token verified for user ID:', decoded.id);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            console.log('Backend: protect middleware - user found in DB:', req.user ? req.user.name : 'Not Found');

            next();
        } catch (error) {
            console.error('Backend: protect middleware - token verification failed:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    console.log('Backend: admin middleware - checking role for user:', req.user ? `${req.user.name} (${req.user.role})` : 'No User');
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.warn('Backend: admin middleware - access denied for role:', req.user ? req.user.role : 'No User');
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const sales = (req, res, next) => {
    if (req.user && (req.user.role === 'sales' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as sales');
    }
};

module.exports = { protect, admin, sales };
