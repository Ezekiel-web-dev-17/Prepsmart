import { z } from "zod";

export const getUniversitiesQuerySchema = z.object({
  search: z.string().optional(),
  type: z.enum(["federal", "state", "private", "all"]).optional(),
  course: z.string().optional(),
  maxCutOff: z.coerce.number().int().min(100).max(400).optional(),
  minCutOff: z.coerce.number().int().min(100).max(400).optional(),
  postUtme: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  zone: z.string().optional(),
  sort: z
    .enum(["cutoff_asc", "cutoff_desc", "name_asc", "name_desc", "est_year"])
    .optional(),
});

export type GetUniversitiesQuery = z.infer<typeof getUniversitiesQuerySchema>;
