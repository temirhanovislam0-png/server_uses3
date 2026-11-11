import { Router } from "express";
import UserController from "../controllers/UserController.js";
import User from "../models/User.js";

const router = new Router();

router.get("/users", UserController.getUsers);
router.get("/user/:id", UserController.getUserOne);
router.post("/registration", UserController.registration);
router.post("/login", UserController.authorization)
router.patch("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

export default router;
