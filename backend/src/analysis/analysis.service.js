import AiService from "../ai/service/ai.service.js";
import { createError } from "../utils/http_error.js";
import AnalysisRepository from "./analysis.repository.js";

class AnalysisService {
  async analysis(id) {
    const find = await AnalysisRepository.find(id);

    if (!find) {
      throw createError("Failed showing answer!", "NOT_FOUND");
    }

    const AiResponse = await AiService.AnalysisData(
      find.user.profilDetail.raportScore,
      find.question,
      find.answers,
      find.user.profilDetail.jurusan,
    );

    return AiResponse;
  }
}

export default new AnalysisService();
