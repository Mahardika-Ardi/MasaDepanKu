import z from "zod";

const answerSchema = z.object({
  1: z.string().min(1),
  2: z.string().min(1),
  3: z.string().min(1),
  4: z.string().min(1),
  5: z.string().min(1),
});

const QuestionSchema = z.object({
  number: z.number().int().min(1).max(20),
  question: z.string().nonempty(),
  answer: answerSchema,
  category: z.enum(["teknis", "sosial", "kreatif", "analitis", "manajerial"]),
});

const QuestionListSchema = z.array(QuestionSchema).length(20);

export const QuestionPayloadSchema = z
  .union([
    QuestionListSchema,
    z.object({
      questions: QuestionListSchema,
    }),
  ])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value;
    }

    return value.questions;
  });
