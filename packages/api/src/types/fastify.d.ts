import "@fastify/jwt";
import "fastify";

import { User } from "@media-tracker/shared";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: User;

    user: User;
  }
}
