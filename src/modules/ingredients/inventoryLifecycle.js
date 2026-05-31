import { Ingredient } from './Ingredient.js';
import { Waste } from '../wastes/Waste.js';
import { broadcastIngredientSnapshot } from '../../realtime/ingredientSocket.js';

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const isExpired = (ingredient, now = new Date()) => {
  if (!ingredient?.expiryDate) return false;
  const expiry = new Date(ingredient.expiryDate);
  if (Number.isNaN(expiry.getTime())) return false;
  return expiry <= now;
};

export async function processExpiredIngredientLots({ broadcast = true } = {}) {
  const now = new Date();
  const expiredIngredients = await Ingredient.find({
    quantity: { $gt: 0 },
    expiryDate: { $ne: null, $lte: now },
    $or: [
      { expiredAt: null },
      { expiredAt: { $exists: false } },
    ],
  });

  if (expiredIngredients.length === 0) {
    return { expiredCount: 0, wastedQuantity: 0 };
  }

  let wastedQuantity = 0;

  for (const ingredient of expiredIngredients) {
    const quantity = toNumber(ingredient.quantity);
    if (quantity <= 0) continue;

    await Waste.create({
      ingredient: ingredient._id,
      itemName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      estimatedCost: quantity * toNumber(ingredient.price_per_unit),
      recordedBy: 'System',
      date: now,
      reason: 'Expired',
      quantity_wasted: quantity,
      total_cost: quantity * toNumber(ingredient.price_per_unit),
    });

    ingredient.quantity = 0;
    ingredient.active_status = false;
    ingredient.expiredAt = now;
    await ingredient.save();
    wastedQuantity += quantity;
  }

  if (broadcast) {
    await broadcastIngredientSnapshot();
  }

  return {
    expiredCount: expiredIngredients.length,
    wastedQuantity,
  };
}

export const hasIngredientExpired = isExpired;
