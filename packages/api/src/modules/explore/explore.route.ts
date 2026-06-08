import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { ExploreController } from "./explore.controller.js";
import { searchQuerySchema, getByIdParamsSchema } from "./explore.schema.js";
import {
  successResponse,
  paginatedResponse,
  MediaItemSchema,
} from "@media-tracker/shared";
import { commonErrorResponses } from "../../plugins/error-handler.js";

export async function exploreRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = new ExploreController();

  app.get(
    "/search",
    {
      schema: {
        tags: ["Explore"],
        security: [{ bearerAuth: [] }],
        querystring: searchQuerySchema,
        response: {
          200: paginatedResponse(MediaItemSchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.search,
  );

  app.get(
    "/item",
    {
      schema: {
        tags: ["Explore"],
        security: [{ bearerAuth: [] }],
        querystring: getByIdParamsSchema,
        response: {
          200: successResponse(MediaItemSchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.getById,
  );
}
