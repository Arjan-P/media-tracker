import type { FastifyRequest } from "fastify";

import { AuthenticationError } from "../errors/index.js";

export function requireUserId(req: FastifyRequest): string {
  const userId = req.user?.sub;

  if (!userId) {
    throw new AuthenticationError();
  }

  return userId;
}
