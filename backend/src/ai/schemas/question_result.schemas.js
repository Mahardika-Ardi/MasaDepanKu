import z from "zod";

const answerSchema = z.object({
  1: z.string().min(1),
  2: z.string().min(1),
  3: z.string().min(1),
  4: z.string().min(1),
  5: z.string().min(1),
});

const QuestionSchema = z.object({
  number: z.number().int().min(1),
  question: z.string().nonempty(),
  answer: answerSchema,
  category: z.enum(["teknis", "sosial", "kreatif", "analitis", "manajerial"]),
});

const QuestionPayloadSchema = z
  .union([
    z.array(QuestionSchema),
    z.object({
      questions: z.array(QuestionSchema),
    }),
  ])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value;
    }

    return value.questions;
  });

export function parseQuestionPayload(rawPayload, totalQuestions) {
  const parsed = QuestionPayloadSchema.parse(rawPayload);

  if (parsed.length !== totalQuestions) {
    throw {
      code: "BAD_REQUEST",
      message: `Question count mismatch. Expected ${totalQuestions}, received ${parsed.length}`,
    };
  }

  return parsed;
}
