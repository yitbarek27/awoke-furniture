const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    approveOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/approve').put(protect, admin, approveOrder);

module.exports = router;
