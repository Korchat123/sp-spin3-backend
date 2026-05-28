import { Router } from 'express';
import { Promotion } from '../modules/promotions/Promotion.js';
import { createPromotion, deletePromotion, getPromotionById, getPromotions, updatePromotion } from '../modules/controller/promotitonController.js';

export const router = Router();


router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);