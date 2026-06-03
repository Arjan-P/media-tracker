import { z } from "zod";

export const userResponseSchema = z.object({
  user: z.object({ userId: z.string(), email: z.string() }),
  accessToken: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
