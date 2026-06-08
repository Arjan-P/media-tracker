import { z } from "zod";
import { MediaTypeSchema } from "@media-tracker/shared";

export const searchQuerySchema = z.object({
  query: z.string().min(1),
  type: MediaTypeSchema, // must pick one type per search
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const getByIdParamsSchema = z.object({
  type: MediaTypeSchema,
  providerId: z.string().min(1),
});

export type SearchQueryType = z.infer<typeof searchQuerySchema>;
export type GetByIdParamsType = z.infer<typeof getByIdParamsSchema>;
