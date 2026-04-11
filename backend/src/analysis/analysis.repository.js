import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import prismaErrors from "../utils/prisma_errors.js";

class AnalisisRepository {
  async find(id) {
    const cachedKey = `user:${id}`;

    try {
      const cached = await redis.get(cachedKey);

      if (cached) {
        return JSON.parse(cached);
      }

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

      if (find) {
        await redis.set(cachedKey, JSON.stringify(find), "EX", 60);
      }

      return find;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new AnalisisRepository();
