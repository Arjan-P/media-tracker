import { z } from "zod";
import {
  meResponseSchema,
  authResponseSchema,
} from "../schemas/auth.schema.js";

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
