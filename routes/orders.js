const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');

// Place a new order
router.post('/', orderController.placeOrder);

// Get all orders (admin)
router.get('/', orderController.getOrders);

// Mark an order as delivered (admin)
router.patch('/:orderId/deliver', orderController.markDelivered);

module.exports = router;
