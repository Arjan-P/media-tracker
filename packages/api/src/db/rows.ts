import type {
  MediaProviderType,
  MediaStatus,
  MediaType,
} from "@media-tracker/shared";

export interface UserRow {
  id: string;
  email: string;

  first_name: string;
  last_name: string;

  password_hash: string;
  created_at: Date;
}

export interface MediaItemRow {
  id: string;
  provider_id: string;
  provider: MediaProviderType;
  type: MediaType;
  name: string;
  description: string | null;
  cover_url: string | null;
  release_date: Date | null;
  meta: Record<string, unknown>;
  created_at: Date;
}

export interface UserMediaRow {
  id: string;
  user_id: string;
  media_item_id: string;

  status: MediaStatus;
  rating: number;
  review: string;

  started_at: Date;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ProgressBase {
  id: string;
  user_media_id: string;
  updated_at: Date;
}

export interface BookProgress {
  current_page: number;
  total_pages: number;
}

export interface TvProgress {
  current_season: number;
  current_episode: number;
  total_seasons: number | null;
  total_episodes: number | null;
}

export interface GameProgress {
  hours_played: number;
  completion_pct: number | null;
}

export interface AnimeProgress {
  current_episode: number;
  total_episodes: number | null;
}

export interface MangaProgress {
  current_chapter: number;
  current_volume: number | null;
  total_chapters: number | null;
  total_volumes: number | null;
}

export type MangaProgressRow = ProgressBase & MangaProgress;
export type AnimeProgressRow = ProgressBase & AnimeProgress;
export type BookProgressRow = ProgressBase & BookProgress;
export type GameProgressRow = ProgressBase & GameProgress;
export type TvProgressRow = ProgressBase & TvProgress;

export type MediaProgress =
  | ({ type: "book" } & BookProgress)
  | ({ type: "tv" } & TvProgress)
  | ({ type: "game" } & GameProgress)
  | ({ type: "anime" } & AnimeProgress)
  | ({ type: "manga" } & MangaProgress);

export interface UserMediaFullRow extends UserMediaRow {
  provider: MediaProviderType;
  provider_id: string;
  type: MediaType;
  name: string;
  description: string | null;
  cover_url: string | null;
  release_date: Date | null;
  progress: MediaProgress;
  meta: Record<string, unknown>;
  item_created_at: Date;
}
