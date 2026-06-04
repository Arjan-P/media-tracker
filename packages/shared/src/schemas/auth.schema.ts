import { z } from "zod";

export const authUserSchema = z.object({
  userId: z.string(),
  email: z.email(),
});

export const userProfileSchema = z.object({
  userId: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
});

export const authResponseSchema = z.object({
  user: z.object({ userId: z.string(), email: z.string() }),
  accessToken: z.string(),
});

export const meResponseSchema = z.object({
  user: userProfileSchema,
});
