const Product = require('../models/Product');

// Add a new product (admin functionality)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }
    const product = new Product({ name, description, price, quantity });
    await product.save();
    res.status(201).json({ message: 'Product added successfully.', product });
  } catch (error) {
    console.error('Add Product error:', error);
    res.status(500).json({ message: 'Server error while adding product.' });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
      const products = await Product.find(); // Fetch all products
      res.status(200).json({ products }); // Return inside an object
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

// Remove a product (admin functionality)
exports.removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Product.findByIdAndDelete(productId);
    if (!result) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product removed successfully.' });
  } catch (error) {
    console.error('Remove Product error:', error);
    res.status(500).json({ message: 'Server error while removing product.' });
  }
};
