import fp from "fastify-plugin";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { env } from "../configs/env/env.js";

export const securityPlugin = fp(async (app) => {
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 60,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
  });
});
