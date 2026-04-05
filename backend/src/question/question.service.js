import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";
import AiService from "../ai/service/ai.service.js";

class QuestionService {
  async create(id) {
    try {
      const generatedQuestion = await AiService.GenerateQuestion();

      const result = await prisma.testSession.create({
        data: {
          userId: id,
          status: "PENDING",
          question: {
            createMany: {
              data: generatedQuestion.map((item) => ({
                number: item.number,
                category: item.category,
                question: item.question,
                answer: item.answer,
              })),
            },
          },
        },
        include: {
          question: {
            orderBy: { number: "asc" },
          },
        },
      });

      if (!result) {
        throw {
          message: "Failed generating question!",
          code: "BAD_REQUEST",
        };
      }

      return result;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new QuestionService();
