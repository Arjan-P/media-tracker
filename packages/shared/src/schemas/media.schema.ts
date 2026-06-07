import { z } from "zod";

export const MediaTypeSchema = z.enum([
  "movie",
  "tv",
  "game",
  "book",
  "anime",
  "manga",
]);

export const MediaItemSchema = z.object({
  id: z.uuid(),
  type: MediaTypeSchema,
  name: z.string(),

  description: z.string().nullable(),

  coverUrl: z.string().nullable(),

  releaseDate: z.string().nullable(),
});
