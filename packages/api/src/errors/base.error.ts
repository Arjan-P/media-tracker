import type { ErrorCode } from "@media-tracker/shared";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Needed for instanceof to work correctly with transpiled classes
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
