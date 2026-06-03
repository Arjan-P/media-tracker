import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";

import { AuthController } from "./auth.controller.js";
import { signUpBodySchema } from "./auth.schema.js";
import { successResponse, userResponseSchema } from "@media-tracker/shared";
import { commonErrorResponses } from "../../plugins/error-handler.js";

export async function authRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = new AuthController(app);

  app.post(
    "/signup",
    {
      schema: {
        tags: ["Auth"],
        body: signUpBodySchema,
        response: {
          201: successResponse(userResponseSchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.signup,
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: signUpBodySchema,
        response: {
          201: successResponse(userResponseSchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.login,
  );
}
