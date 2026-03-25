import z from "zod";

export const CreateQuestionDto = z.object({
  user_id: z.number().int(),
});