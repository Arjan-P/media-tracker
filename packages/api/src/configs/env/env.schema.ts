import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["developement", "test", "production"])
    .default("developement"),
  PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), { message: "PORT must be a number" }),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  FRONTEND_URL: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  TMDB_API_KEY: z.string(),
});
