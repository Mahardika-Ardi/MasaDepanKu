import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import prismaErrors from "../utils/prisma_errors.js";

class UseranswerRepository {
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

      return saveAnswer;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async findAll(id) {
    const cachedKey = `user:${id}`;

    try {
      const cached = await redis.get(cachedKey);

      if (cached) {
        return JSON.parse(cached);
      }

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

      if (showAllAnswer) {
        await redis.set(cachedKey, JSON.stringify(showAllAnswer), "EX", 60);
      }

      return showAllAnswer;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new UseranswerRepository();
