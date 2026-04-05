import { z } from "zod";

export const UseranswerCreateDto = z.object({
  sessionId: z.number().min(1).optional(),
  questionId: z.number().min(1).optional(),
  value: z.number().min(1),
});
