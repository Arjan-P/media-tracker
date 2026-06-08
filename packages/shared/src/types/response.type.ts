import { z } from "zod";
import {
  authResponseSchema,
  errorResponse,
  meResponseSchema,
} from "../schemas/response.schema.js";

export const ERROR_CODES = [
  // Generic
  "AUTHENTICATION_ERROR",
  "CONFLICT_ERROR",
  "NOT_FOUND_ERROR",
  "BAD_REQUEST_ERROR",
  "VALIDATION_ERROR",
  "INTERNAL_SERVER_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    message?: string;
  };
};
export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  meta?: {
    message?: string;
  };
};

export type ErrorResponse = z.infer<typeof errorResponse>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
