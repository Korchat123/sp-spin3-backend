import { Router } from "express";
import { Menu } from "../../modules/Menus/Menu.js";
import { createMenu, getMenu } from "../../modules/Menus/menuController.js";

export const router = Router();

router.get("/", getMenu);
router.post("/", createMenu);
