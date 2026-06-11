import type { PostgresDb } from "@fastify/postgres";
import type { MediaItemRow, UserMediaFullRow } from "../../db/rows.js";
import { Progress } from "@media-tracker/shared";
import { UpdateMediaBodyType } from "./library.schema.js";

const USER_MEDIA_SELECT = `
  SELECT
    um.*,

    mi.provider,
    mi.provider_id,
    mi.type,
    mi.name,
    mi.description,
    mi.cover_url,
    mi.release_date,
    mi.meta,
    mi.created_at AS item_created_at,

    CASE
      WHEN mi.type = 'book' AND bp.id IS NOT NULL THEN
        json_build_object(
          'type', 'book',
          'current_page', bp.current_page,
          'total_pages', bp.total_pages
        )

      WHEN mi.type = 'tv' AND tvp.id IS NOT NULL THEN
        json_build_object(
          'type', 'tv',
          'current_season', tvp.current_season,
          'current_episode', tvp.current_episode,
          'total_seasons', tvp.total_seasons,
          'total_episodes', tvp.total_episodes
        )

      WHEN mi.type = 'game' AND gp.id IS NOT NULL THEN
        json_build_object(
          'type', 'game',
          'hours_played', gp.hours_played,
          'completion_pct', gp.completion_pct
        )

      WHEN mi.type = 'anime' AND ap.id IS NOT NULL THEN
        json_build_object(
          'type', 'anime',
          'current_episode', ap.current_episode,
          'total_episodes', ap.total_episodes
        )

      WHEN mi.type = 'manga' AND mp.id IS NOT NULL THEN
        json_build_object(
          'type', 'manga',
          'current_chapter', mp.current_chapter,
          'current_volume', mp.current_volume,
          'total_chapters', mp.total_chapters,
          'total_volumes', mp.total_volumes
        )

      ELSE NULL
    END AS progress

  FROM user_media um

  JOIN media_items mi
    ON mi.id = um.media_item_id

  LEFT JOIN book_progress bp
    ON bp.user_media_id = um.id

  LEFT JOIN tv_progress tvp
    ON tvp.user_media_id = um.id

  LEFT JOIN game_progress gp
    ON gp.user_media_id = um.id

  LEFT JOIN anime_progress ap
    ON ap.user_media_id = um.id

  LEFT JOIN manga_progress mp
    ON mp.user_media_id = um.id
`;

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
  ): Promise<UserMediaFullRow | null> {
    const insertResult = await this.db.query<{ id: string }>(
      `
    INSERT INTO user_media (user_id, media_item_id)
    VALUES ($1, $2)
    RETURNING id
    `,
      [userId, mediaItemId],
    );

    const userMediaId = insertResult.rows[0]?.id;

    if (!userMediaId) {
      return null;
    }

    return this.findOne(userMediaId, userId);
  }

  async updateMedia(
    id: string,
    userId: string,
    data: UpdateMediaBodyType,
  ): Promise<UserMediaFullRow | null> {
    // Build the SET clause dynamically — only touch columns that were provided
    const sets: string[] = ["updated_at = now()"];
    const params: unknown[] = [];
    let i = 1;

    if (data.status !== undefined) {
      sets.push(`
      status = $${i}::media_status,
      started_at = CASE
        WHEN $${i} = 'in_progress'::media_status AND started_at IS NULL THEN now()
        ELSE started_at
      END,
      completed_at = CASE
        WHEN $${i} = 'completed'::media_status THEN now()
        ELSE completed_at
      END
    `);
      params.push(data.status);
      i++;
    }

    if (data.rating !== undefined) {
      sets.push(`rating = $${i++}`);
      params.push(data.rating);
    }

    if (data.review !== undefined) {
      sets.push(`review = $${i++}`);
      params.push(data.review);
    }

    params.push(id, userId); // $i, $i+1

    const result = await this.db.query<{ id: string }>(
      `UPDATE user_media
     SET ${sets.join(", ")}
     WHERE id = $${i} AND user_id = $${i + 1}
     RETURNING id`,
      params,
    );

    if (!result.rows[0]) return null;

    // Handle progress upsert after the user_media update
    if (data.progress !== undefined) {
      await this.upsertProgress(id, data.progress);
    }

    return this.findOne(id, userId);
  }

  private async upsertProgress(
    userMediaId: string,
    data: Progress,
  ): Promise<void> {
    const { type, progress } = data;

    if (type === "movie") return; // movies have no progress

    const tableMap = {
      book: {
        table: "book_progress",
        cols: ["current_page", "total_pages"],
        vals: (p: any) => [p.currentPage, p.totalPages],
      },
      tv: {
        table: "tv_progress",
        cols: [
          "current_season",
          "current_episode",
          "total_seasons",
          "total_episodes",
        ],
        vals: (p: any) => [
          p.currentSeason,
          p.currentEpisode,
          p.totalSeasons,
          p.totalEpisodes,
        ],
      },
      game: {
        table: "game_progress",
        cols: ["hours_played", "completion_pct"],
        vals: (p: any) => [p.hoursPlayed, p.completionPct],
      },
      anime: {
        table: "anime_progress",
        cols: ["current_episode", "total_episodes"],
        vals: (p: any) => [p.currentEpisode, p.totalEpisodes],
      },
      manga: {
        table: "manga_progress",
        cols: [
          "current_chapter",
          "current_volume",
          "total_chapters",
          "total_volumes",
        ],
        vals: (p: any) => [
          p.currentChapter,
          p.currentVolume,
          p.totalChapters,
          p.totalVolumes,
        ],
      },
    } as const;

    const { table, cols, vals } = tableMap[type];
    const values = vals(progress);
    const params = [userMediaId, ...values];
    const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");
    const updateSet = cols.map((col) => `${col} = EXCLUDED.${col}`).join(", ");

    await this.db.query(
      `INSERT INTO ${table} (user_media_id, ${cols.join(", ")})
     VALUES (${placeholders})
     ON CONFLICT (user_media_id) DO UPDATE SET ${updateSet}, updated_at = now()`,
      params,
    );
  }

  async findByUser(
    userId: string,
    filters: { status?: string; type?: string; page: number; limit: number },
  ): Promise<{ rows: UserMediaFullRow[]; total: number }> {
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
      this.db.query<UserMediaFullRow>(
        `
    ${USER_MEDIA_SELECT}
    WHERE ${where}
    ORDER BY um.updated_at DESC
    LIMIT $${i}
    OFFSET $${i + 1}
    `,
        [...params, filters.limit, offset],
      ),
      this.db.query<{ count: string }>(
        `
    SELECT COUNT(*)
    FROM user_media um
    JOIN media_items mi ON mi.id = um.media_item_id
    WHERE ${where}
    `,
        params,
      ),
    ]);
    return { rows, total: parseInt(countResult.rows[0].count) };
  }

  async findOne(id: string, userId: string): Promise<UserMediaFullRow | null> {
    const result = await this.db.query<UserMediaFullRow>(
      `
    ${USER_MEDIA_SELECT}
    WHERE um.id = $1
      AND um.user_id = $2
    `,
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
