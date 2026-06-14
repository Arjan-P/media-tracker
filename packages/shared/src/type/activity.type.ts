import { z } from "zod";
import {
  ActivityLogEntrySchema,
  activityTypeSchema,
} from "../schemas/activity.schema.js";

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type ActivityLogEntry = z.infer<typeof ActivityLogEntrySchema>;
