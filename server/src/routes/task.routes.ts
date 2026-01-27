import express from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../utils/jwt";
import { authorizeTaskOwner } from "../middlewares/authorizeTaskOwner";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, authorizeTaskOwner, getTask);
router.post("/create", authMiddleware, createTask);
router.post("/update/:id", authMiddleware, authorizeTaskOwner, updateTask);
router.post("/delete/:id", authMiddleware, authorizeTaskOwner, deleteTask);

export default router;
