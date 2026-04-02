import { z } from "zod";

export const QuestionCreateDto = z.object({
  user_id: z.number(),
});
