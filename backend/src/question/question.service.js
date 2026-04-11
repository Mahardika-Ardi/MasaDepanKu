import AiService from "../ai/service/ai.service.js";
import { createError } from "../utils/http_error.js";
import QuestionRepository from "./question.repository.js";

class QuestionService {
  async create(id) {
    const generatedQuestion = await AiService.GenerateQuestion();
    const result = await QuestionRepository.create(id, generatedQuestion);

    if (!result) {
      throw createError("Failed generating question", "BAD_REQUEST");
    }

    return result;
  }
}

export default new QuestionService();
