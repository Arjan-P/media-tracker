import { FastifyPluginAsync } from "fastify";
import { authRoutes } from "../modules/auth/auth.route.js";
import { exploreRoutes } from "../modules/explore/explore.route.js";

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(exploreRoutes, { prefix: "/explore" });
};
