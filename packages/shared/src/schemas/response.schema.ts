import { z } from "zod";
import { ERROR_CODES } from "../types/response.type.js";
import { userProfileSchema } from "./auth.schema.js";

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  count: z.int(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

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
 * Paginated Response
 */
export const paginatedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: paginationSchema,
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

export const authResponseSchema = z.object({
  user: userProfileSchema,
  accessToken: z.string(),
});

export const meResponseSchema = z.object({
  user: userProfileSchema,
});
