import { generateText } from "../ai/client/gemini.client.js";
import { buildQuestionPrompt } from "../ai/prompts/question.prompt.js";
import { QuestionPayloadSchema } from "../ai/schemas/question_result.schemas.js";

function normalizeText(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return cleaned;
}
class AiService {
  async GenerateQuestion() {
    const prompt = buildQuestionPrompt;
    const raw = await generateText(prompt, {
      temperature: 0.6,
    });

    const normal = normalizeText(raw);
    const json = JSON.parse(normal);
    const parsed = QuestionPayloadSchema.parse(json);

    return parsed;
  }
}

export default new AiService();
