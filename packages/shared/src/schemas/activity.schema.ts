import { z } from "zod";

export const activityTypeSchema = z.enum([
  "added",
  "status_changed",
  "rated",
  "reviewed",
  "progress_updated",
  "removed",
]);

export const ActivityLogEntrySchema = z.object({
  id: z.uuid(),
  type: activityTypeSchema,
  data: z.record(z.string(), z.unknown()),
  media: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      coverUrl: z.string().nullable(),
      type: z.string().nullable(),
    })
    .nullable(),
  createdAt: z.string().datetime(),
});
