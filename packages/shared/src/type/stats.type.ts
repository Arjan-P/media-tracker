import { z } from "zod";
import { statsResponseSchema } from "../schemas/stats.schema.js";

export type StatsResponse = z.infer<typeof statsResponseSchema>;
