import Fastify, { type FastifyInstance } from "fastify";
import { loggerConfig } from "./configs/logger.js";
import { dbPlugin } from "./plugins/db.js";
import { zodPlugin } from "./plugins/zod.js";
import { openApiPlugin } from "./plugins/openapi.js";
import { authPlugin } from "./plugins/auth.js";
import { errorPlugin } from "./plugins/error-handler.js";

import { routes } from "./routes/index.js";

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerConfig });

  // register plugins
  await app.register(dbPlugin);
  await app.register(zodPlugin);
  await app.register(openApiPlugin);
  await app.register(authPlugin);
  await app.register(errorPlugin);

  // register routes
  await app.register(routes, { prefix: "/api" });

  return app;
}
