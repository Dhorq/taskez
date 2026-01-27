import express from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../utils/jwt";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTask);
router.post("/create", authMiddleware, createTask);
router.post("/update/:id", authMiddleware, updateTask);
router.post("/delete/:id", authMiddleware, deleteTask);

export default router;
