import { WebSocket, WebSocketServer } from 'ws';
import { Ingredient } from '../modules/ingredients/Ingredient.js';
import { Menu } from '../modules/menus/Menu.js';

let ingredientSocketServer;

const withStockStatus = (menu) => {
  const item = menu.toObject ? menu.toObject() : menu;
  const linkedIngredients = Array.isArray(item.ingredients) ? item.ingredients : [];
  const missingIngredients = linkedIngredients
    .filter((entry) => {
      const ingredient = entry.ingredient;
      return (
        !ingredient ||
        ingredient.active_status === false ||
        Number(ingredient.quantity || 0) < Number(entry.quantity || 0)
      );
    })
    .map((entry) => ({
      name: entry.ingredient?.name || 'Unknown ingredient',
      required: Number(entry.quantity || 0),
      available: Number(entry.ingredient?.quantity || 0),
      unit: entry.ingredient?.unit || '',
    }));

  return {
    ...item,
    soldOut: item.available === false || missingIngredients.length > 0,
    soldOutReason:
      item.available === false
        ? 'Menu unavailable'
        : missingIngredients.length > 0
          ? 'Ingredient stock is not enough'
          : '',
    missingIngredients,
  };
};

async function sendIngredientSnapshot(socket) {
  const [ingredients, menus] = await Promise.all([
    Ingredient.find().sort({ ingredient_index: 1, name: 1 }),
    Menu.find({}).populate('ingredients.ingredient').sort({ name: 1 }),
  ]);

  socket.send(
    JSON.stringify({
      type: 'ingredient:snapshot',
      ingredients,
      menus: menus.map(withStockStatus),
    }),
  );
}

export function initIngredientSocket(server) {
  ingredientSocketServer = new WebSocketServer({ server, path: '/ws/ingredients' });

  ingredientSocketServer.on('connection', (socket) => {
    sendIngredientSnapshot(socket).catch((err) => {
      socket.send(JSON.stringify({ type: 'error', message: err.message }));
    });
  });
}

export async function broadcastIngredientSnapshot() {
  if (!ingredientSocketServer) return;

  const openSockets = [...ingredientSocketServer.clients].filter(
    (socket) => socket.readyState === WebSocket.OPEN,
  );
  if (openSockets.length === 0) return;

  const [ingredients, menus] = await Promise.all([
    Ingredient.find().sort({ ingredient_index: 1, name: 1 }),
    Menu.find({}).populate('ingredients.ingredient').sort({ name: 1 }),
  ]);
  const payload = JSON.stringify({
    type: 'ingredient:snapshot',
    ingredients,
    menus: menus.map(withStockStatus),
  });

  openSockets.forEach((socket) => {
    socket.send(payload);
  });
}
