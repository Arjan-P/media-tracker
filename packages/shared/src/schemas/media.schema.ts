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

export const MediaItemSchema = z.object({
  provider: MediaProvider,
  providerId: z.string(),
  type: MediaTypeSchema,
  name: z.string(),

  description: z.string().nullable(),

  coverUrl: z.string().nullable(),

  releaseDate: z.string().nullable(),
});
