const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller');

// Get all products
router.get('/', productController.getProducts);

// Add a new product (admin)
router.post('/', productController.addProduct);

// Remove a product by its ID (admin)
router.delete('/:productId', productController.removeProduct);

module.exports = router;
