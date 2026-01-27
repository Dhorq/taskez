import express from "express";

import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../utils/jwt";

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.post("/update/:id", authMiddleware, updateTask);
router.post("/delete/:id", authMiddleware, deleteTask);

export default router;
