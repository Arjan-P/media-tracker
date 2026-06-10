import { z } from "zod";
import {
  MediaProvider,
  MediaTypeSchema,
  MediaStatusSchema,
} from "@media-tracker/shared";

// POST /tracker — add an item (upserts media_items, creates user_media)
export const addMediaBodySchema = z.object({
  provider: MediaProvider,
  providerId: z.string().min(1),
  type: MediaTypeSchema,
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  releaseDate: z.string().date().nullable().optional(),
});

// PATCH /tracker/:id/status
export const updateStatusBodySchema = z.object({
  status: MediaStatusSchema,
});

// PATCH /tracker/:id/rating
export const rateBodySchema = z.object({
  rating: z.number().int().min(1).max(10),
});

// PATCH /tracker/:id/review
export const reviewBodySchema = z.object({
  review: z.string().min(1).max(10_000),
});

// GET /tracker?status=&type=&page=&limit=
export const listQuerySchema = z.object({
  status: MediaStatusSchema.optional(),
  type: MediaTypeSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: z.uuid() });

export type AddMediaBodyType = z.infer<typeof addMediaBodySchema>;
export type UpdateStatusBodyType = z.infer<typeof updateStatusBodySchema>;
export type RateBodyType = z.infer<typeof rateBodySchema>;
export type ReviewBodyType = z.infer<typeof reviewBodySchema>;
export type ListQueryType = z.infer<typeof listQuerySchema>;
