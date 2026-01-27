import express from "express";

import { createTask, updateTask } from "../controllers/task.controller";
import { authMiddleware } from "../utils/jwt";

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.post("/update/:id", authMiddleware, updateTask);

export default router;
