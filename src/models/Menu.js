import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  image: { 
    type: String 
  },
  category: { 
    type: String,
    enum: ['chicken', 'burger', 'combo', 'drink', 'side', 'dessert'],
    required: true 
  },
  cookingTime: { 
    type: Number, 
    required: true,
    description: 'Estimated cooking time in seconds'
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Menu = mongoose.model('Menu', menuSchema);
