import { z } from "zod";
import {
  MediaItemSchema,
  MediaProvider,
  MediaTypeSchema,
} from "../schemas/media.schema.js";

export type MediaProviderType = z.infer<typeof MediaProvider>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
