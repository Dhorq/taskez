import { NextFunction, Request, Response } from "express";
import { createTaskSchema } from "../validations/taskValidation";
import { taskResponseSchema } from "../validations/task.response.schema";
import { prisma } from "../../lib/prisma";

interface createTaskBody {
  title: string;
  content: string;
}

export async function createTask(
  req: Request<{}, {}, createTaskBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title, content } = createTaskSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;

    const newTask = await prisma.task.create({
      data: { authorId: userId, title, content },
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
