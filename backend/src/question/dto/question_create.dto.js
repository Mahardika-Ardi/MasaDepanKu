import { z } from "zod";

export const QuestionCreateDto = z.object({
  user_id: z.number().int(),
  total_questions: z.number().int().min(4).max(40).optional().default(20),
});
