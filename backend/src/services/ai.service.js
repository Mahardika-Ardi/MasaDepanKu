import { generateText } from "../ai/client/gemini.client.js";
import { buildQuestionPrompt } from "../ai/prompts/question.prompt.js";
import { QuestionSchema } from "../ai/schemas/question_result.schemas.js";

class AiService {
  async GenerateQuestion() {
    const prompt = buildQuestionPrompt();
    const raw = await generateText(prompt, {
      temperature: 0.6,
      maxOutputTokens: 1200,
    });

    const json = JSON.parse(raw);
    const parsed = QuestionSchema.parse(json);

    return [parsed];
  }
}

export default new AiService();
