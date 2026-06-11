import { z } from "zod";
import {
  MediaProvider,
  MediaTypeSchema,
  MediaStatusSchema,
  progressSchema,
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

// PATCH /tracker/:id
export const updateMediaBodySchema = z
  .object({
    status: MediaStatusSchema.optional(),
    rating: z.number().int().min(1).max(10).optional(),
    review: z.string().min(1).max(10_000).optional(),
    progress: progressSchema.optional(),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.rating !== undefined ||
      data.review !== undefined ||
      data.progress !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

// GET /tracker?status=&type=&page=&limit=
export const listQuerySchema = z.object({
  status: MediaStatusSchema.optional(),
  type: MediaTypeSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: z.uuid() });

export type AddMediaBodyType = z.infer<typeof addMediaBodySchema>;
export type UpdateMediaBodyType = z.infer<typeof updateMediaBodySchema>;
export type ListQueryType = z.infer<typeof listQuerySchema>;
