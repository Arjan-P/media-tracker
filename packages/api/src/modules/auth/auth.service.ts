import { User } from "@media-tracker/shared";
import bcrypt from "bcrypt";

import type { FastifyInstance } from "fastify";

import { AuthRepository } from "./auth.repository.js";
import { AuthenticationError, ConflictError } from "../../errors/index.js";

export class AuthService {
  private readonly repo: AuthRepository;

  constructor(private readonly app: FastifyInstance) {
    this.repo = new AuthRepository(app.pg);
  }

  async signup(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> {
    const existing = await this.repo.findByEmail(email);

    if (existing) {
      throw new ConflictError("Email exists");
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await this.repo.createUser(email, hash);

    const token = this.app.jwt.sign({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        userId: user.id,
        email: user.email,
      },
      accessToken: token,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = this.app.jwt.sign({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        userId: user.id,
        email: user.email,
      },
      accessToken: token,
    };
  }
}
