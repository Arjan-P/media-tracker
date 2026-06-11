import { z } from "zod";
import { progressSchema } from "../schemas/progress.schema.js";

export type Progress = z.infer<typeof progressSchema>;
