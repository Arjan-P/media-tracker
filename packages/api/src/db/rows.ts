type MediaType = "movie" | "tv" | "game" | "book" | "anime" | "manga";

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
  provider: string;
  type: MediaType;
  name: string;
  description: string | null;
  coverUrl: string | null;
  releaseDate: Date | null;
  meta: Record<string, unknown>;
  createdAt: Date;
}
