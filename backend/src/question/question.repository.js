import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import prismaErrors from "../utils/prisma_errors.js";

class QuestionRepository {
  async create(id, question) {
    const cachedKey = `user:${id}`;

    try {
      const cached = await redis.get(cachedKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const result = await prisma.testSession.create({
        data: {
          userId: id,
          status: "PENDING",
          question: {
            createMany: {
              data: question.map((item) => ({
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

      if (result) {
        await redis.set(cachedKey, JSON.stringify(result), "EX", 60);
      }

      return result;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new QuestionRepository();
