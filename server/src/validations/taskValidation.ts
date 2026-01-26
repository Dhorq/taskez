import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Minimum of 3 characters").max(100),
  content: z.string().max(500).optional(),
  published: z.boolean().optional().default(false),
  authorId: z
    .number()
    .int()
    .positive("AuthorId must be valid in integer number"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  content: z.string().max(500).optional(),
  published: z.boolean().optional(),
});
