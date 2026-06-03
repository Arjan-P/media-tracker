import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from "@fastify/type-provider-zod";

export const openApiPlugin = fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Media Tracker API",
        description: "Media tracking backend",
        version: "1.0.0",
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  await app.register(scalarApiReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "deepSpace",
    },
  });
});
