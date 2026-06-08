import type { MediaProviderType, MediaType } from "@media-tracker/shared";

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
  providerId: string;
  provider: MediaProviderType;
  type: MediaType;
  name: string;
  description: string | null;
  coverUrl: string | null;
  releaseDate: Date | null;
  meta: Record<string, unknown>;
  createdAt: Date;
}
