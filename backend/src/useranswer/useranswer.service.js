import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class UseranswerService {
  async create(data) {
    try {
      const saveAnswer = await prisma.userAnswer.upsert({
        where: {
          sessionId_questionId: {
            sessionId: Number(data.sessionId),
            questionId: Number(data.questionId),
          },
        },
        update: {
          value: Number(data.value),
        },

        create: {
          sessionId: Number(data.sessionId),
          questionId: Number(data.questionId),
          value: Number(data.value),
        },
      });

      if (!saveAnswer) {
        throw {
          message: "Failed saving question answer!",
          code: "BAD_REQUEST",
        };
      }

      return saveAnswer;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async findall(id) {
    try {
      const showAllAnswer = await prisma.userAnswer.findMany({
        where: { session: { userId: id } },
        include: {
          question: {
            select: {
              number: true,
              question: true,
              answer: true,
              category: true,
            },
          },
        },
        orderBy: { question: { number: "asc" } },
      });

      if (!showAllAnswer) {
        throw {
          message: "Failed showwing answer!",
          code: "BAD_REQUEST",
        };
      }

      return showAllAnswer;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new UseranswerService();
