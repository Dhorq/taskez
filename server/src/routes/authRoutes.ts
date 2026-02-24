import express from "express";
import { login, logout, me, register } from "../controllers/authControllers.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { authMiddleware } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", register, errorHandler);
router.post("/login", login, errorHandler);
router.post("/refresh-token", logout, errorHandler);

router.get("/me", authMiddleware, me, errorHandler);
router.post("/logout", authMiddleware, logout, errorHandler);

export default router;
