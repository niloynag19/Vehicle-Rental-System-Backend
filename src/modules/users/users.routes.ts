import express from "express"
import { usersController } from "./users.controllers";

const router=express.Router();
router.post("/auth/signup",usersController.createUsers);

export const usersRoutes=router