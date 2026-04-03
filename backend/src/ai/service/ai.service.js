import { generateText } from "../client/gemini.client.js";
import { analysisPrompt } from "../prompts/analysis.prompt.js";
import { buildQuestionPrompt } from "../prompts/question.prompt.js";
import { careerAnalysisSchemas } from "../schemas/career_analysis.schemas.js";
import { parseQuestionPayload } from "../schemas/question_result.schemas.js";

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
  async GenerateQuestion(totalQuestions = 20) {
    const prompt = buildQuestionPrompt(totalQuestions);
    const raw = await generateText(prompt, { temperature: 0.6 });

    const normal = normalizeText(raw);
    const json = JSON.parse(normal);
    const parsed = parseQuestionPayload(json, totalQuestions);

    return parsed;
  }

  async AnalysisData(score, question, answer) {
    const prompt = analysisPrompt(score, question, answer);
    const raw = await generateText(prompt, { temperature: 0.7 });

    const cleanedText = normalizeText(raw);
    const parsed = JSON.parse(cleanedText);
    const validated = careerAnalysisSchemas.parse(parsed);

    return validated;
  }
}

export default new AiService();
