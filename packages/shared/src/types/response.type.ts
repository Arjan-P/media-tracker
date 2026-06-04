import { z } from "zod";
import { errorResponse } from "../schemas/response.schema.js";

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
export type ErrorResponse = z.infer<typeof errorResponse>;
