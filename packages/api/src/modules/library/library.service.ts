import type { FastifyInstance } from "fastify";
import { LibraryRepository } from "./library.repository.js";
import type { AddMediaBodyType, ListQueryType } from "./library.schema.js";
import type { UserMediaWithItemRow } from "../../db/rows.js";
import type { LibraryEntry, MediaStatus } from "@media-tracker/shared";

function toLibraryEntry(row: UserMediaWithItemRow): LibraryEntry {
  return {
    id: row.id,
    mediaItem: {
      id: row.media_item_id,
      provider: row.provider as any,
      providerId: row.provider_id,
      type: row.type as any,
      name: row.name,
      description: row.description,
      coverUrl: row.cover_url,
      releaseDate: row.release_date?.toISOString().split("T")[0] ?? null,
      createdAt: row.item_created_at.toISOString(),
    },
    status: row.status as any,
    rating: row.rating,
    review: row.review,
    startedAt: row.started_at?.toISOString() ?? null,
    completedAt: row.completed_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class LibraryService {
  private readonly repo: LibraryRepository;

  constructor(app: FastifyInstance) {
    this.repo = new LibraryRepository(app.pg);
  }

  async addMedia(
    userId: string,
    data: AddMediaBodyType,
  ): Promise<LibraryEntry> {
    const mediaItem = await this.repo.upsertMediaItem({
      provider: data.provider,
      provider_id: data.providerId,
      type: data.type,
      name: data.name,
      description: data.description ?? null,
      cover_url: data.coverUrl ?? null,
      release_date: data.releaseDate ? new Date(data.releaseDate) : null,
      meta: {},
    });
    const row = await this.repo.addToLibrary(userId, mediaItem.id);
    return toLibraryEntry(row);
  }

  async updateStatus(
    id: string,
    userId: string,
    status: MediaStatus,
  ): Promise<LibraryEntry | null> {
    const row = await this.repo.updateStatus(id, userId, status);
    if (!row) return null;
    return toLibraryEntry(row);
  }

  async updateRating(
    id: string,
    userId: string,
    rating: number,
  ): Promise<LibraryEntry | null> {
    const row = await this.repo.updateRating(id, userId, rating);
    if (!row) return null;
    return toLibraryEntry(row);
  }

  async updateReview(
    id: string,
    userId: string,
    review: string,
  ): Promise<LibraryEntry | null> {
    const row = await this.repo.updateReview(id, userId, review);
    if (!row) return null;
    return toLibraryEntry(row);
  }

  async getById(id: string, userId: string): Promise<LibraryEntry | null> {
    const row = await this.repo.findOne(id, userId);
    return row ? toLibraryEntry(row) : null;
  }

  async list(userId: string, query: ListQueryType) {
    const result = await this.repo.findByUser(userId, query);
    return {
      rows: result.rows.map(toLibraryEntry),
      total: result.total,
    };
  }

  async remove(id: string, userId: string): Promise<boolean> {
    return this.repo.remove(id, userId);
  }
}
