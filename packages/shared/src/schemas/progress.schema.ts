import { z } from "zod";

export const bookProgressSchema = z.object({
  currentPage: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
});

export const tvProgressSchema = z.object({
  currentSeason: z.number().int().positive(),
  currentEpisode: z.number().int().positive(),
  totalSeasons: z.number().int().positive().nullable(),
  totalEpisodes: z.number().int().positive().nullable(),
});

export const gameProgressSchema = z.object({
  hoursPlayed: z.number().nonnegative(),
  completionPct: z.number().int().min(0).max(100).nullable(),
});

export const animeProgressSchema = z.object({
  currentEpisode: z.number().int().positive(),
  totalEpisodes: z.number().int().positive().nullable(),
});

export const mangaProgressSchema = z.object({
  currentChapter: z.number().int().positive(),
  currentVolume: z.number().int().positive().nullable(),
  totalChapters: z.number().int().positive().nullable(),
  totalVolumes: z.number().int().positive().nullable(),
});

// Discriminated union — one type, one shape
export const progressSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("book"), progress: bookProgressSchema }),
  z.object({ type: z.literal("tv"), progress: tvProgressSchema }),
  z.object({ type: z.literal("game"), progress: gameProgressSchema }),
  z.object({ type: z.literal("anime"), progress: animeProgressSchema }),
  z.object({ type: z.literal("manga"), progress: mangaProgressSchema }),
  z.object({ type: z.literal("movie"), progress: z.null() }),
]);
