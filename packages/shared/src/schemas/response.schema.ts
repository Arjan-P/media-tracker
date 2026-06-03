import { z } from "zod";
import { ERROR_CODES } from "../types/api.js";

/**
 * Generic success response
 */
export const successResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        message: z.string().optional(),
      })
      .optional(),
  });

/**
 * Generic error response
 */
export const errorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.enum(ERROR_CODES),
    message: z.string(),
    // TODO: strip details behind an isDev flag
    details: z.any().optional(),
  }),
});
