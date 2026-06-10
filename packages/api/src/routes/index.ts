import { FastifyPluginAsync } from "fastify";
import { authRoutes } from "../modules/auth/auth.route.js";
import { exploreRoutes } from "../modules/explore/explore.route.js";
import { libraryRoutes } from "../modules/library/library.route.js";

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(exploreRoutes, { prefix: "/explore" });
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", protectedRoutes.authenticate);

    protectedRoutes.register(libraryRoutes, {
      prefix: "/library",
    });
  });
};
