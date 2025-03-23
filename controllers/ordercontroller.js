const Order = require('../models/Order');
const Product = require('../models/Product');

// Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { user, products } = req.body;
    // Validate input
    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'User and products are required for placing an order.' });
    }
    // Calculate total price
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;
    }
    const order = new Order({
      user,
      products,
      totalPrice,
      status: 'pending'
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('Place Order error:', error);
    res.status(500).json({ message: 'Server error while placing order.' });
  }
};

// Get all orders (admin functionality)
exports.getOrders = async (req, res) => {
  try {
    // Populate user and product information for clarity
    const orders = await Order.find()
      .populate('user')
      .populate('products.product');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get Orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

// Mark an order as delivered (admin functionality)
exports.markDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    order.status = 'delivered';
    await order.save();
    res.status(200).json({ message: 'Order marked as delivered.', order });
  } catch (error) {
    console.error('Mark Delivered error:', error);
    res.status(500).json({ message: 'Server error while updating order.' });
  }
};
