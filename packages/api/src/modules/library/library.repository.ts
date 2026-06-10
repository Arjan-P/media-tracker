import type { PostgresDb } from "@fastify/postgres";
import type { MediaItemRow, UserMediaWithItemRow } from "../../db/rows.js";
import { MediaStatus } from "@media-tracker/shared";

export class LibraryRepository {
  constructor(private readonly db: PostgresDb) {}

  async upsertMediaItem(
    data: Omit<MediaItemRow, "id" | "created_at">,
  ): Promise<MediaItemRow> {
    const result = await this.db.query<MediaItemRow>(
      `
        INSERT INTO media_items (provider, provider_id, type, name, description, cover_url, release_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (provider, provider_id) DO UPDATE
          SET NAME = EXCLUDED.name,
            description = EXCLUDED.description,
            cover_url = EXCLUDED.cover_url
        RETURNING *
      `,
      [
        data.provider,
        data.provider_id,
        data.type,
        data.name,
        data.description,
        data.cover_url,
        data.release_date,
      ],
    );
    return result.rows[0];
  }

  async addToLibrary(
    userId: string,
    mediaItemId: string,
  ): Promise<UserMediaWithItemRow> {
    const result = await this.db.query<UserMediaWithItemRow>(
      `WITH inserted AS (
       INSERT INTO user_media (user_id, media_item_id)
       VALUES ($1, $2)
       RETURNING *
       )
       SELECT i.*,
              mi.provider, mi.provider_id, mi.type, mi.name,
              mi.description, mi.cover_url, mi.release_date, mi.meta,
              mi.created_at as item_created_at
       FROM inserted i
       JOIN media_items mi ON mi.id = i.media_item_id`,
      [userId, mediaItemId],
    );
    return result.rows[0];
  }

  async updateStatus(
    id: string,
    userId: string,
    status: MediaStatus,
  ): Promise<UserMediaWithItemRow | null> {
    const result = await this.db.query<UserMediaWithItemRow>(
      `WITH updated AS (
       UPDATE user_media SET
         status = $1::media_status,
         started_at   = CASE WHEN $1 = 'in_progress'::media_status AND started_at IS NULL THEN now() ELSE started_at END,
         completed_at = CASE WHEN $1 = 'completed'::media_status THEN now() ELSE completed_at END,
         updated_at   = now()
       WHERE id = $2 AND user_id = $3
       RETURNING *
     )
     SELECT u.*,
            mi.provider, mi.provider_id, mi.type, mi.name,
            mi.description, mi.cover_url, mi.release_date, mi.meta,
            mi.created_at as item_created_at
     FROM updated u
     JOIN media_items mi ON mi.id = u.media_item_id`,
      [status, id, userId],
    );
    return result.rows[0] ?? null;
  }

  async updateRating(
    id: string,
    userId: string,
    rating: number,
  ): Promise<UserMediaWithItemRow | null> {
    const result = await this.db.query<UserMediaWithItemRow>(
      `WITH updated AS (
       UPDATE user_media SET rating = $1, updated_at = now()
       WHERE id = $2 AND user_id = $3
       RETURNING *
     )
     SELECT u.*,
            mi.provider, mi.provider_id, mi.type, mi.name,
            mi.description, mi.cover_url, mi.release_date, mi.meta,
            mi.created_at as item_created_at
     FROM updated u
     JOIN media_items mi ON mi.id = u.media_item_id`,
      [rating, id, userId],
    );
    return result.rows[0] ?? null;
  }

  async updateReview(
    id: string,
    userId: string,
    review: string,
  ): Promise<UserMediaWithItemRow | null> {
    const result = await this.db.query<UserMediaWithItemRow>(
      `WITH updated AS (
       UPDATE user_media SET review = $1, updated_at = now()
       WHERE id = $2 AND user_id = $3
       RETURNING *
     )
     SELECT u.*,
            mi.provider, mi.provider_id, mi.type, mi.name,
            mi.description, mi.cover_url, mi.release_date, mi.meta,
            mi.created_at as item_created_at
     FROM updated u
     JOIN media_items mi ON mi.id = u.media_item_id`,
      [review, id, userId],
    );
    return result.rows[0] ?? null;
  }

  async findByUser(
    userId: string,
    filters: { status?: string; type?: string; page: number; limit: number },
  ): Promise<{ rows: UserMediaWithItemRow[]; total: number }> {
    const conditions = ["um.user_id = $1"];
    const params: unknown[] = [userId];
    let i = 2;

    if (filters.status) {
      conditions.push(`um.status = $${i++}`);
      params.push(filters.status);
    }
    if (filters.type) {
      conditions.push(`mi.type = $${i++}`);
      params.push(filters.type);
    }

    const where = conditions.join(" AND ");
    const offset = (filters.page - 1) * filters.limit;

    const [{ rows }, countResult] = await Promise.all([
      this.db.query<UserMediaWithItemRow>(
        `SELECT um.*, 
                mi.provider, mi.provider_id, mi.type, mi.name,
                mi.description, mi.cover_url, mi.release_date, mi.meta,
                mi.created_at as item_created_at
         FROM user_media um
         JOIN media_items mi ON mi.id = um.media_item_id
         WHERE ${where}
         ORDER BY um.updated_at DESC
         LIMIT $${i} OFFSET $${i + 1}`,
        [...params, filters.limit, offset],
      ),
      this.db.query<{ count: string }>(
        `SELECT COUNT(*) FROM user_media um
         JOIN media_items mi ON mi.id = um.media_item_id
         WHERE ${where}`,
        params,
      ),
    ]);
    return { rows, total: parseInt(countResult.rows[0].count) };
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<UserMediaWithItemRow | null> {
    const result = await this.db.query<UserMediaWithItemRow>(
      `SELECT um.*,
              mi.provider, mi.provider_id, mi.type, mi.name,
              mi.description, mi.cover_url, mi.release_date, mi.meta,
              mi.created_at as item_created_at
       FROM user_media um
       JOIN media_items mi ON mi.id = um.media_item_id
       WHERE um.id = $1 AND um.user_id = $2`,
      [id, userId],
    );
    return result.rows[0] ?? null;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM user_media WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
