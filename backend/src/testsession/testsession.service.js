import prisma from "../config/prisma.config.js";
import { createError } from "../utils/http_error.utils.js";
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
      throw prismaError || error;
    }
  }

  async finish(id) {
    try {
      const finishSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "COMPLETED" },
      });

      if (!finishSession) {
        throw createError("Failed finishing test session", "BAD_REQUEST");
      }

      return finishSession;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }

  async cancel(id) {
    try {
      const cancelSession = await prisma.testSession.update({
        where: { userId: id },
        data: { status: "FAILED" },
      });

      if (!cancelSession) {
        throw createError("Failed canceling test session", "BAD_REQUEST");
      }

      return cancelSession;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
}

export default new TestsessionService();
