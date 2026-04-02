import AiService from "../ai/service/ai.service.js";
import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class AnalysisService {
  async analysis(id, data) {
    try {
      const Analysis = await prisma.$transaction([
        prisma.profilDetail.findFirst({ where: { user_id: id } }),
        // prisma.
      ]);
      const AiResponse = await AiService.AnalysisData();
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new AnalysisService();
