import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";

import { ActivityController } from "./activity.controller.js";
import { activityListQuerySchema } from "./activity.schema.js";

import {
  ActivityLogEntrySchema,
  paginatedResponse,
} from "@media-tracker/shared";

import { commonErrorResponses } from "../../plugins/error-handler.js";

export async function activityRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  const controller = new ActivityController(app);

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Activity"],
        security: [{ bearerAuth: [] }],
        querystring: activityListQuerySchema,
        response: {
          200: paginatedResponse(ActivityLogEntrySchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.list.bind(controller),
  );
}
