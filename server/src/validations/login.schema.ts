import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  name: z.string().nullable(),
  token: z.string(),
});
