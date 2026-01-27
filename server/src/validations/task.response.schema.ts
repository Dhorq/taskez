import { z } from "zod";

export const taskResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  authorId: z.number().int(),
});

export const taskListResponseSchema = z.array(taskResponseSchema);
