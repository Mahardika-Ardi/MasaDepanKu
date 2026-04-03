import { z } from "zod";

export const AnalysisCreateDto = z.object({
  group_question_id: z.number().int().positive().optional(),
});
