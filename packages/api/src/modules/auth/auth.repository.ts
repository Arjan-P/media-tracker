import type { PostgresDb } from "@fastify/postgres";

import type { UserRow } from "../../db/rows.js";

export class AuthRepository {
  constructor(private readonly db: PostgresDb) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await this.db.query<UserRow>(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
  ): Promise<UserRow> {
    const result = await this.db.query<UserRow>(
      `
      INSERT INTO users (
        email,
        first_name,
        last_name,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [email, firstName, lastName, passwordHash],
    );

    return result.rows[0];
  }

  async findById(id: string): Promise<UserRow | null> {
    const result = await this.db.query<UserRow>(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
