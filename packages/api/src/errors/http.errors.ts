import { AppError } from "./base.error.js";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super("NOT_FOUND_ERROR", message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown) {
    super("CONFLICT_ERROR", message, 409, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super("BAD_REQUEST_ERROR", message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super("AUTHENTICATION_ERROR", message, 401, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super("VALIDATION_ERROR", message, 422, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details?: unknown) {
    super("INTERNAL_SERVER_ERROR", message, 500, details);
  }
}
