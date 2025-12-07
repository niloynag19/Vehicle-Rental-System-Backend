import express from "express"
import { usersController } from "./users.controllers";
import auth from "../../middleware/auth";

const router=express.Router();
router.post("/auth/signup",usersController.createUsers);

router.get("/users",auth('admin'),usersController.getAllUsers)

router.get("/users/:id",auth("admin","customer"),usersController.getSingleUsers)

router.put("/users/:id",auth('admin','customer'),usersController.putUsers)

router.delete("/users/:id",auth('admin','customer'),usersController.deleteUsers)

export const usersRoutes=router
