import { z } from "zod";
import { MediaStatusSchema } from "./media.schema.js";

export const statsResponseSchema = z.object({
  statusCounts: z.array(
    z.object({
      status: MediaStatusSchema,
      count: z.number().int().nonnegative(),
    }),
  ),
  total: z.number().int().nonnegative(),
  activityByDay: z.array(
    z.object({
      day: z.string(),
      count: z.number().int().nonnegative(),
    }),
  ),
  heatmap: z.array(z.object({ day: z.string(), count: z.number().int() })),
});
