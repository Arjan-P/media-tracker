import { z } from "zod";
import {
  MediaItemSchema,
  MediaProvider,
  MediaStatusSchema,
  MediaTypeSchema,
  SavedMediaItemSchema,
  LibraryEntrySchema,
} from "../schemas/media.schema.js";

export type MediaStatus = z.infer<typeof MediaStatusSchema>;
export type MediaProviderType = z.infer<typeof MediaProvider>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type SavedMediaItem = z.infer<typeof SavedMediaItemSchema>;
export type LibraryEntry = z.infer<typeof LibraryEntrySchema>;
