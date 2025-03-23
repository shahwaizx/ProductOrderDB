const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    products: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          default: 1 
        }
      }
    ],
    totalPrice: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      default: 'pending' // Other possible statuses: delivered, canceled, etc.
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
