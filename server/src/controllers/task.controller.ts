import { NextFunction, Request, Response } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/taskValidation";
import {
  taskListResponseSchema,
  taskResponseSchema,
} from "../validations/task.response.schema";
import { prisma } from "../../lib/prisma";
import logger from "../config/logger";

interface createTaskBody {
  title: string;
  content: string;
}

type Params = {
  id: string;
};

interface updateTaskBody {
  title: string;
  content: string;
}

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info("Get tasks attempt", {
      ip: req.ip,
    });

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: { authorId: userId },
    });

    logger.info("Task fetched successfully", {
      userId: req.user.id,
      tasks,
    });

    const response = taskListResponseSchema.parse(tasks);

    res.status(200).json({
      success: true,
      message: "Task successfully fetched",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(
  req: Request<Params>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info("Get task attempt", {
      ip: req.ip,
    });

    const id = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    logger.info("Task updated successfully", {
      userId: id,
      task,
    });

    const response = taskResponseSchema.parse(task);

    res.status(200).json({
      success: true,
      message: "Task successfully fetched",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(
  req: Request<{}, {}, createTaskBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info("Create task attempt", {
      title: req.body.title,
      ip: req.ip,
    });

    const { title, content } = createTaskSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;

    const newTask = await prisma.task.create({
      data: { authorId: userId, title, content },
    });

    logger.info("Task updated successfully", {
      userId: newTask.id,
      title: newTask.title,
      content: newTask.content,
    });

    const response = taskResponseSchema.parse(newTask);

    res.status(201).json({
      success: true,
      message: "Task successfully created",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request<Params, {}, updateTaskBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info("Update task attempt", {
      title: req.body.title,
      ip: req.ip,
    });

    const { title, content } = updateTaskSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;

    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const task = await prisma.task.findFirst({
      where: { id, authorId: userId },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { authorId: userId, title, content },
    });

    logger.info("Task updated successfully", {
      taskId: updatedTask.id,
      id,
    });

    const response = taskResponseSchema.parse(updatedTask);

    res.status(200).json({
      success: true,
      message: "Task successfully updated",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) {
  try {
    logger.info("Delete task attempt", {
      ip: req.ip,
    });

    const id = Number(req.params.id);

    const deletedTask = await prisma.task.delete({ where: { id } });

    logger.info("Task deleted successfully", {
      taskId: deletedTask.id,
      id,
    });

    const response = taskResponseSchema.parse(deletedTask);

    res.status(200).json({
      success: true,
      message: "Task successfully deleted",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
