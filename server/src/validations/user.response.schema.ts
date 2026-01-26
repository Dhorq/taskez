import { z } from "zod";
import { taskResponseSchema } from "./task.response.schema";

export const userResponseSchema = z.object({
  email: z.string(),
  name: z.string(),
  tasks: z.array(taskResponseSchema).default([]),
});
