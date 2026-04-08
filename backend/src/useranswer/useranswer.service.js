import prisma from "../config/prisma.config.js";
import { createError } from "../utils/http_error.utils.js";
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
        throw createError("Failed saving answer", "BAD_REQUEST");
      }

      return saveAnswer;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
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
        throw createError("Failed showing answer!", "NOT_FOUND");
      }

      return showAllAnswer;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
}

export default new UseranswerService();
