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
