import { z } from "zod";

export const signUpBodySchema = z.object({
  email: z.email(),

  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),

  password: z.string().min(8),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignUpBodyType = z.infer<typeof signUpBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
