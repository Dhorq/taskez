import express from "express";

import { createTask } from "../controllers/task.controller";
import { authMiddleware } from "../utils/jwt";

const router = express.Router();

router.post("/create", authMiddleware, createTask);

export default router;
