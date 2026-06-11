import type { FastifyInstance } from "fastify";
import { LibraryRepository } from "./library.repository.js";
import type {
  AddMediaBodyType,
  ListQueryType,
  UpdateMediaBodyType,
} from "./library.schema.js";
import type { MediaProgress, UserMediaFullRow } from "../../db/rows.js";
import type { LibraryEntry, Progress } from "@media-tracker/shared";

export function progressRowToDto(
  progress: MediaProgress | null,
): Progress | null {
  if (!progress) return null;

  switch (progress.type) {
    case "book":
      return {
        type: "book",
        progress: {
          currentPage: progress.current_page,
          totalPages: progress.total_pages,
          percentage:
            progress.total_pages > 0
              ? Math.round((progress.current_page / progress.total_pages) * 100)
              : 0,
        },
      };

    case "tv":
      return {
        type: "tv",
        progress: {
          currentSeason: progress.current_season,
          currentEpisode: progress.current_episode,
          totalSeasons: progress.total_seasons,
          totalEpisodes: progress.total_episodes,
        },
      };

    case "game":
      return {
        type: "game",
        progress: {
          hoursPlayed: progress.hours_played,
          completionPct: progress.completion_pct,
        },
      };

    case "anime":
      return {
        type: "anime",
        progress: {
          currentEpisode: progress.current_episode,
          totalEpisodes: progress.total_episodes,
        },
      };

    case "manga":
      return {
        type: "manga",
        progress: {
          currentChapter: progress.current_chapter,
          currentVolume: progress.current_volume,
          totalChapters: progress.total_chapters,
          totalVolumes: progress.total_volumes,
        },
      };

    default:
      return null;
  }
}

function toLibraryEntry(row: UserMediaFullRow): LibraryEntry {
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
    progress: progressRowToDto(row.progress),
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
    if (!row) {
      // TODO: handle null row
      throw new Error();
    }
    return toLibraryEntry(row);
  }

  async updateMedia(
    id: string,
    userId: string,
    data: UpdateMediaBodyType,
  ): Promise<LibraryEntry | null> {
    const row = await this.repo.updateMedia(id, userId, data);
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
