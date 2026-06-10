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

export interface UserMediaWithItemRow extends UserMediaRow {
  provider: MediaProviderType;
  provider_id: string;
  type: MediaType;
  name: string;
  description: string | null;
  cover_url: string | null;
  release_date: Date | null;
  meta: Record<string, unknown>;
  item_created_at: Date;
}
