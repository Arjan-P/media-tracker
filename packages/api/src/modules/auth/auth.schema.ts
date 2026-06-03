import { z } from "zod";

export const signUpBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignUpBodyType = z.infer<typeof signUpBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
