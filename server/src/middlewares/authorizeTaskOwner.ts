import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

export async function authorizeTaskOwner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { authorId: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.authorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    next(error);
  }
}
