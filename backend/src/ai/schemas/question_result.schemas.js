import z from "zod";

const answerSchema = z.object({
  1: z.string().min(1),
  2: z.string().min(1),
  3: z.string().min(1),
  4: z.string().min(1),
  5: z.string().min(1),
});

export const QuestionSchema = z.object({
  number: z.number().int().min(1).max(20),
  question: z.string().nonempty(),
  answer: answerSchema,
  category: z.enum(["teknis", "sosial", "kreatif", "analitis", "manajerial"]),
});