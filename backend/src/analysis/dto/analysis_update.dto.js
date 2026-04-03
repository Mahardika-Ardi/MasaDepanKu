import { z } from "zod";

export const AnalysisUpdateDto = z.object({
  group_question_id: z.number().int().positive().optional(),
});
