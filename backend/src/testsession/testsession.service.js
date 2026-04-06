import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class TestsessionService {
  async find(id) {
    try {
      const findSession = await prisma.testSession.findFirst({
        where: { userId: id, status: "PENDING" },
        include: {
          question: {
            orderBy: { number: "asc" },
          },
          answers: true,
        },
      });

      if (!findSession) {
        return null;
      }

      return findSession;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async finish(id) {
    try {
      const finishSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "COMPELETED" },
      });

      if (!finishSession) {
        throw {
          message: "Failed finishing quest test session!",
          code: "BAD_REQUEST",
        };
      }

      return finishSession;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async cancel(id) {
    try {
      const cancelSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "FAILED" },
      });

      if (!cancelSession) {
        throw {
          message: "Failed finishing quest test session!",
          code: "BAD_REQUEST",
        };
      }

      return cancelSession;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new TestsessionService();
