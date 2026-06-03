import { FastifyPluginAsync } from "fastify";
import { authRoutes } from "../modules/auth/auth.route.js";

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: "/auth" });
};
