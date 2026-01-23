import express from "express";
import { register } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", register);
router.post("/refresh-token", register);

router.post("/logout", register);

export default router;
