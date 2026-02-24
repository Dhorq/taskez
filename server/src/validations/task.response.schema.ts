import { z } from "zod";

export const taskResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.string(),
  status: z.string(),
  published: z.boolean(),
  authorId: z.number().int(),
});

export const taskListResponseSchema = z.array(taskResponseSchema);
