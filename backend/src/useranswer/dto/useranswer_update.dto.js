import { z } from "zod";

const answerValueSchema = z.number().int().min(1).max(5);

export const UseranswerUpdateDto = z.object({
  group_question_id: z.number().int().positive(),
  answers: z
    .array(z.union([answerValueSchema, z.object({ value: answerValueSchema })]))
    .min(1),
});
