import { Router } from 'express';
import { Menu } from '../modules/Menus/Menu.js';
import { router as apiRoutes } from './routes/index.js'
import { createMenu, getMenus } from "./modules/controller.js";

export const router =  Router();

router.get("/menus", getMenus);
router.post("/menus", createMenu);
