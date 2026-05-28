import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Menu } from './src/models/Menu.js';
import { connectDB } from './src/configs/mongodb.js';

dotenv.config();

const menuItems = [
  {
    name: 'Classic Fried Chicken',
    description: 'Crispy golden fried chicken',
    price: 89,
    image: 'https://via.placeholder.com/300x300?text=Fried+Chicken',
    category: 'fried-chicken',
    cookingTime: 600 // 10 minutes
  },
  {
    name: 'Spicy Fried Chicken',
    description: 'Hot and spicy fried chicken',
    price: 99,
    image: 'https://via.placeholder.com/300x300?text=Spicy+Chicken',
    category: 'fried-chicken',
    cookingTime: 600
  },
  {
    name: 'Honey Butter Chicken',
    description: 'Sweet honey butter fried chicken',
    price: 109,
    image: 'https://via.placeholder.com/300x300?text=Honey+Butter',
    category: 'fried-chicken',
    cookingTime: 720 // 12 minutes
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 39,
    image: 'https://via.placeholder.com/300x300?text=Fries',
    category: 'side',
    cookingTime: 180 // 3 minutes
  },
  {
    name: 'Coleslaw',
    description: 'Fresh coleslaw',
    price: 29,
    image: 'https://via.placeholder.com/300x300?text=Coleslaw',
    category: 'side',
    cookingTime: 60 // 1 minute
  },
  {
    name: 'Corn on the Cob',
    description: 'Grilled corn with butter',
    price: 49,
    image: 'https://via.placeholder.com/300x300?text=Corn',
    category: 'side',
    cookingTime: 300 // 5 minutes
  },
  {
    name: 'Iced Tea',
    description: 'Fresh iced tea',
    price: 19,
    image: 'https://via.placeholder.com/300x300?text=Iced+Tea',
    category: 'drink',
    cookingTime: 0 // No cooking
  },
  {
    name: 'Soft Drink',
    description: 'Cold soft drink',
    price: 25,
    image: 'https://via.placeholder.com/300x300?text=Soft+Drink',
    category: 'drink',
    cookingTime: 0
  },
  {
    name: 'Chocolate Pie',
    description: 'Homemade chocolate pie',
    price: 59,
    image: 'https://via.placeholder.com/300x300?text=Chocolate+Pie',
    category: 'dessert',
    cookingTime: 0
  },
  {
    name: 'Combo Meal A',
    description: 'Fried chicken + fries + drink',
    price: 149,
    image: 'https://via.placeholder.com/300x300?text=Combo+A',
    category: 'combo',
    cookingTime: 600
  }
];

async function seedMenus() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing menus
    await Menu.deleteMany({});
    console.log('Cleared existing menus');

    // Insert new menus
    const result = await Menu.insertMany(menuItems);
    console.log(`✅ Seeded ${result.length} menu items`);
    
    result.forEach(item => {
      console.log(`  - ${item.name} (${item.cookingTime}s cooking time)`);
    });

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    process.exit(0);
  }
}

seedMenus();
