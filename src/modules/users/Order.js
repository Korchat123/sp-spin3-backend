import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Menu'
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  cookingTime: { 
    type: Number, 
    description: 'Cooking time in seconds from menu'
  },
  status: { 
    type: String, 
    enum: ['InKitchen', 'Cook', 'finished', 'cancel'], 
    default: 'InKitchen' 
  },
  orderTime: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  type: { type: String, enum: ['delivery', 'Onsite'], required: true },
  customer: {
    name: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    note: { type: String }
  },
  orderList: [orderItemSchema],
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
