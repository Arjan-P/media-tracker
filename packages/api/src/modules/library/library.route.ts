import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { LibraryController } from "./library.controller.js";
import {
  addMediaBodySchema,
  idParamSchema,
  listQuerySchema,
  updateMediaBodySchema,
} from "./library.schema.js";
import {
  LibraryEntrySchema,
  successResponse,
  paginatedResponse,
} from "@media-tracker/shared";
import { commonErrorResponses } from "../../plugins/error-handler.js";

export async function libraryRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = new LibraryController(app);

  app.post(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Library"],
        security: [{ bearerAuth: [] }],
        body: addMediaBodySchema,
        response: {
          201: successResponse(LibraryEntrySchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.addMedia.bind(controller),
  );

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Library"],
        security: [{ bearerAuth: [] }],
        querystring: listQuerySchema,
        response: {
          200: paginatedResponse(LibraryEntrySchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.list.bind(controller),
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Library"],
        security: [{ bearerAuth: [] }],
        params: idParamSchema,
        response: {
          200: successResponse(LibraryEntrySchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.getOne.bind(controller),
  );

  app.patch(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Library"],
        security: [{ bearerAuth: [] }],
        params: idParamSchema,
        body: updateMediaBodySchema,
        response: {
          200: successResponse(LibraryEntrySchema),
          ...commonErrorResponses,
        },
      },
    },
    controller.updateMedia.bind(controller),
  );

  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Library"],
        security: [{ bearerAuth: [] }],
        params: idParamSchema,
        response: {
          204: z.null(),
          ...commonErrorResponses,
        },
      },
    },
    controller.remove.bind(controller),
  );
}
