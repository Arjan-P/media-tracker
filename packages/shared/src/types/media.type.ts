import { z } from "zod";
import { MediaItemSchema, MediaTypeSchema } from "../schemas/media.schema.js";

export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
