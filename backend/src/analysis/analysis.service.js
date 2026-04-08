import AiService from "../ai/service/ai.service.js";
import prisma from "../config/prisma.config.js";
import { createError } from "../utils/http_error.utils.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class AnalysisService {
  async analysis(id) {
    try {
      const find = await prisma.testSession.findFirst({
        where: { userId: id },
        select: {
          user: {
            select: {
              profilDetail: { select: { raportScore: true, jurusan: true } },
            },
          },
          question: { orderBy: { number: "asc" } },
          answers: { orderBy: { questionId: "asc" } },
        },
      });

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
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
}

export default new AnalysisService();
