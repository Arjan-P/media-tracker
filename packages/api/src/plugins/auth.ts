import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

import { env } from "../configs/env/env.js";
import { AuthenticationError } from "../errors/http.errors.js";

export const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch {
      throw new AuthenticationError();
    }
  });
});
