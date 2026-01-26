import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string(),
  name: z.string().min(5).max(10),
  password: z.string().min(8).max(12),
});
