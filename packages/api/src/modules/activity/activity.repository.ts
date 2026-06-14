import type { PostgresDb } from "@fastify/postgres";
import { ActivityLogFullRow } from "../../db/rows.js";
import { ActivityType } from "@media-tracker/shared";

export class ActivityRepository {
  constructor(private readonly db: PostgresDb) {}
  async record(
    userId: string,
    type: ActivityType,
    data: Record<string, unknown>,
    mediaItemId?: string | null,
    userMediaId?: string | null,
  ): Promise<void> {
    await this.db.query(
      `
        INSERT INTO activity_log (user_id, media_item_id, user_media_id, type, data)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        userId,
        mediaItemId ?? null,
        userMediaId ?? null,
        type,
        JSON.stringify(data),
      ],
    );
  }

  async getActivityByDay(
    userId: string,
    days: number,
  ): Promise<{ day: string; count: number }[]> {
    const result = await this.db.query<{ day: string; count: string }>(
      `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, COUNT(*) as count
     FROM activity_log
     WHERE user_id = $1 AND created_at >= now() - interval '1 day' * $2
     GROUP BY day
     ORDER BY day`,
      [userId, days],
    );
    return result.rows.map((r) => ({ day: r.day, count: parseInt(r.count) }));
  }

  async getActivityHeatmap(
    userId: string,
  ): Promise<{ day: string; count: number }[]> {
    const result = await this.db.query<{ day: string; count: string }>(
      `
    WITH days AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '364 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date AS day
    ),
    activity_counts AS (
      SELECT
        DATE(created_at) AS day,
        COUNT(*) AS count
      FROM activity_log
      WHERE user_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '364 days'
      GROUP BY DATE(created_at)
    )
    SELECT
      TO_CHAR(days.day, 'YYYY-MM-DD') AS day,
      COALESCE(activity_counts.count, 0) AS count
    FROM days
    LEFT JOIN activity_counts
      ON activity_counts.day = days.day
    ORDER BY days.day
    `,
      [userId],
    );
    return result.rows.map((r) => ({ day: r.day, count: parseInt(r.count) }));
  }

  // TODO: add type based filter
  async findByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ActivityLogFullRow[]; total: number }> {
    const offset = (page - 1) * limit;

    const [{ rows }, countResult] = await Promise.all([
      this.db.query<ActivityLogFullRow>(
        `
          SELECT
            al.*,
            mi.name AS media_name,
            mi.cover_url AS media_cover_url,
            mi.type AS media_type
          FROM activity_log al
          JOIN media_items mi ON mi.id = al.media_item_id
          WHERE al.user_id = $1
          ORDER BY al.created_at DESC
          LIMIT $2 OFFSET $3
        `,
        [userId, limit, offset],
      ),
      this.db.query(
        `
          SELECT COUNT(*) FROM activity_log WHERE user_id = $1
        `,
        [userId],
      ),
    ]);
    return { rows, total: parseInt(countResult.rows[0].count) };
  }
}
