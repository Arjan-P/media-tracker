import fp from "fastify-plugin";
import { errorResponse } from "@media-tracker/shared";
import { AppError } from "../errors/index.js";

import { fail } from "../utils/response.js";

export const commonErrorResponses = {
  400: errorResponse,
  401: errorResponse,
  404: errorResponse,
  409: errorResponse,
  500: errorResponse,
} as const;

export const errorPlugin = fp(async (app) => {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    // App error
    if (error instanceof AppError) {
      return reply
        .status(error.statusCode)
        .send(fail(error.code, error.message));
    }

    return reply
      .status(500)
      .send(fail("INTERNAL_SERVER_ERROR", "An unexpected error occured"));
  });
});
