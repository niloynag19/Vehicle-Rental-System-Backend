import { Router } from "express";
import { authController } from "./auth.controllers";

const router=Router();
router.post('/auth/signin',authController.loginUsers)

export const authRoutes=router;