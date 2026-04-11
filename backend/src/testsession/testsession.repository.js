import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import prismaErrors from "../utils/prisma_errors.js";

class Testsessionrepository {
  async find(id) {
    const cachedKey = `user:${id}`;

    try {
      const cached = await redis.get(cachedKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const findSession = await prisma.testSession.findFirst({
        where: { userId: id, status: "PENDING" },
        include: {
          question: {
            orderBy: { number: "asc" },
          },
          answers: true,
        },
      });

      if (findSession) {
        await redis.set(cachedKey, JSON.stringify(findSession), "EX", 60);
      }

      return findSession;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async finish(id) {
    try {
      const finishSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "COMPLETED" },
      });

      return finishSession;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async cancel(id) {
    try {
      const cancelSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "FAILED" },
      });

      return cancelSession;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new Testsessionrepository();
