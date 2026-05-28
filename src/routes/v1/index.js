import { Router } from "express";
import { router as usersRoute } from "./userRoute.js";
import { router as menuRouter } from "./menuRoute.js";


export const router = Router();

router.use("/user", usersRoute);
router.use("/menu", menuRouter);
