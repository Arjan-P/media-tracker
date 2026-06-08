import type {
  ErrorCode,
  ErrorResponse,
  Pagination,
} from "@media-tracker/shared";

export function ok<T>(data: T, message?: string) {
  return {
    success: true as const,
    data,
    meta: message ? { message } : undefined,
  };
}

export function paginated<T>(
  data: T[],
  pagination: Pagination,
  message?: string,
) {
  return {
    success: true as const,
    data,
    pagination,
    meta: message ? { message } : undefined,
  };
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ErrorResponse {
  return {
    success: false as const,
    error: {
      code,
      message,
      details,
    },
  };
}
