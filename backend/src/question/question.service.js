import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";
import AiService from "../ai/service/ai.service.js";

class QuestionService {
  async create(data) {
    try {
      const generatedQuestion = await AiService.GenerateQuestion();

      const result = await prisma.$transaction(async (tx) => {
        const addGroupQuestion = await tx.groupQuestion.create({
          data: { user_id: data.user_id },
        });
        const payload = generatedQuestion.map((item) => ({
          ...item,
          group_id: addGroupQuestion.id,
        }));

        await tx.question.createMany({
          data: payload,
        });

        const question = await tx.question.findMany({
          where: { group_id: addGroupQuestion.id },
          orderBy: { number: "asc" },
        });

        return {
          generated_by: addGroupQuestion.user_id,
          group_question_id: addGroupQuestion.id,
          question,
        };
      });

      if (!result) {
        throw {
          message: "Failed generating question, error!",
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
