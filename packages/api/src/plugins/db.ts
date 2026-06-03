import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

import { env } from "../configs/env/env.js";

export const dbPlugin = fp(async (app) => {
  await app.register(fastifyPostgres, {
    connectionString: env.DATABASE_URL,

    max: 10,
    idleTimeoutMillis: 20_000,
  });
});
