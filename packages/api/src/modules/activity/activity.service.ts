import type { FastifyInstance } from "fastify";
import { ActivityRepository } from "./activity.repository.js";
import type { ActivityLogFullRow } from "../../db/rows.js";
import type { ActivityLogEntry } from "@media-tracker/shared";

function toDto(row: ActivityLogFullRow): ActivityLogEntry {
  return {
    id: row.id,
    type: row.type,
    data: row.data,
    media: row.media_item_id
      ? {
          id: row.media_item_id,
          name: row.media_name,
          coverUrl: row.media_cover_url,
          type: row.media_type,
        }
      : null,
    createdAt: row.created_at.toISOString(),
  };
}

export class ActivityService {
  private readonly repo: ActivityRepository;
  constructor(app: FastifyInstance) {
    this.repo = new ActivityRepository(app.pg);
  }

  async list(userId: string, page: number, limit: number) {
    const result = await this.repo.findByUser(userId, page, limit);
    return { rows: result.rows.map(toDto), total: result.total };
  }
}
