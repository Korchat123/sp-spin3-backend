import { Ingredient } from './Ingredient.js';
import { broadcastIngredientSnapshot } from '../../realtime/ingredientSocket.js';

export async function getAllIngredients(req, res) {
  try {
    const ingredients = await Ingredient.find().sort({ ingredient_index: 1, name: 1 });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getIngredientsByStatus(req, res) {
  try {
    const ingredients = await Ingredient.find({ active_status: true }).sort({
      ingredient_index: 1,
      name: 1,
    });

    const grouped = {
      in_stock: [],
      low_stock: [],
      out_of_stock: [],
    };

    ingredients.forEach((item) => {
      if (item.quantity === 0) {
        grouped.out_of_stock.push(item);
      } else if (item.quantity < item.low_stock_threshold) {
        grouped.low_stock.push(item);
      } else {
        grouped.in_stock.push(item);
      }
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getIngredient(req, res) {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateIngredientStock(req, res) {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Quantity must be a number' });
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    await broadcastIngredientSnapshot();
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateIngredient(req, res) {
  try {
    const allowedFields = [
      'name',
      'quantity',
      'unit',
      'price_per_unit',
      'low_stock_threshold',
      'active_status',
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (updates.unit !== undefined && !String(updates.unit).trim()) {
      return res.status(400).json({ error: 'Unit is required' });
    }

    ['quantity', 'price_per_unit', 'low_stock_threshold'].forEach((field) => {
      if (updates[field] !== undefined) {
        updates[field] = Number(updates[field]);
      }
    });

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    await broadcastIngredientSnapshot();
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function decreaseIngredientStock(req, res) {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    if (ingredient.quantity < amount) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    ingredient.quantity -= amount;
    await ingredient.save();

    await broadcastIngredientSnapshot();
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createIngredient(req, res) {
  try {
    const { ingredient_index, name, quantity, unit, price_per_unit, low_stock_threshold } =
      req.body;

    if (!name || !unit || price_per_unit === undefined) {
      return res
        .status(400)
        .json({ error: 'Missing required fields' });
    }

    const nextIndex =
      ingredient_index !== undefined
        ? Number(ingredient_index)
        : (await Ingredient.countDocuments()) + 1;

    const ingredient = new Ingredient({
      ingredient_index: nextIndex,
      name,
      quantity: quantity || 0,
      unit,
      price_per_unit,
      low_stock_threshold: low_stock_threshold || 0,
      active_status: true,
    });

    await ingredient.save();
    await broadcastIngredientSnapshot();
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
