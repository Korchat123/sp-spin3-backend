import { Router } from "express";
import { Menu } from "../../modules/menus/Menu.js";
import {
  createMenu,
  deleteMenu,
  getMenu,
  putMenu,
} from "../../modules/menus/menuController.js";

export const router = Router();

router.get("/", getMenu);
router.post("/", createMenu);
router.put("/:id", putMenu);
router.delete("/:id", deleteMenu);
