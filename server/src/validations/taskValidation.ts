import { z } from "zod";

const priorityEnum = z.enum(["low", "medium", "high"]);
const statusEnum = z.enum(["new", "review", "delivery", "completed"]);

export const createTaskSchema = z.object({
  title: z.string().min(3, "Minimum of 3 characters").max(100),
  description: z.string().max(500).optional(),
  priority: priorityEnum.default("low"),
  status: statusEnum.default("new"),
  published: z.boolean().optional().default(false),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  published: z.boolean().optional(),
});
