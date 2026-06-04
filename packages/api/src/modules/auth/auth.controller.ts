import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "./auth.service.js";
import { LoginBodyType, SignUpBodyType } from "./auth.schema.js";
import { ok } from "../../utils/response.js";

export class AuthController {
  private readonly service: AuthService;

  constructor(private readonly app: FastifyInstance) {
    this.service = new AuthService(app);
  }

  signup = async (
    request: FastifyRequest<{ Body: SignUpBodyType }>,
    reply: FastifyReply,
  ) => {
    const { email, password, firstName, lastName } = request.body;
    const result = await this.service.signup(
      email,
      firstName,
      lastName,
      password,
    );

    return reply.status(201).send(ok(result));
  };

  login = async (request: FastifyRequest<{ Body: LoginBodyType }>) => {
    const { email, password } = request.body;
    const result = await this.service.login(email, password);

    return ok(result);
  };

  me = async (request: FastifyRequest) => {
    const result = await this.service.me(request.user.sub);

    return ok(result);
  };
}
