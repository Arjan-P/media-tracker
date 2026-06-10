import { z } from "zod";

export const MediaProvider = z.enum(["tmdb", "igdb", "openlibrary", "jikan"]);

export const MediaTypeSchema = z.enum([
  "movie",
  "tv",
  "game",
  "book",
  "anime",
  "manga",
]);

export const MediaStatusSchema = z.enum([
  "planned",
  "in_progress",
  "completed",
  "dropped",
]);

export const MediaItemSchema = z.object({
  provider: MediaProvider,
  providerId: z.string(),
  type: MediaTypeSchema,
  name: z.string(),

  description: z.string().nullable(),

  coverUrl: z.string().nullable(),

  releaseDate: z.string().nullable(),
});

export const SavedMediaItemSchema = MediaItemSchema.extend({
  id: z.uuid(),
  createdAt: z.string().datetime(),
});

export const LibraryEntrySchema = z.object({
  id: z.uuid(), // user_media.id
  mediaItem: SavedMediaItemSchema, // joined media_items row
  status: MediaStatusSchema,
  rating: z.number().int().min(1).max(10).nullable(),
  review: z.string().nullable(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
