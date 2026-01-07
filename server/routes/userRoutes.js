const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getUsers,
    adminCreateUser,
    deleteUser,
    getSalesUsers,
} = require('../controllers/userController');
const { protect, admin, sales } = require('../middleware/authMiddleware');

router.route('/admin').post(protect, admin, adminCreateUser);

router.route('/sales').get(protect, sales, getSalesUsers);

router.route('/')
    .get(protect, admin, getUsers)
    .post(registerUser);

router.post('/login', authUser);

router.route('/profile').get(protect, getUserProfile);

router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
