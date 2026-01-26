import express from "express";
import { login, register } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", register);

router.post("/logout", register);

export default router;
