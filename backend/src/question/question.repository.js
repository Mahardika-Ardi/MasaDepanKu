import prisma from "../config/prisma.js";
import prismaErrors from "../utils/prisma_errors.js";

class QuestionRepository {
  async create(id, question) {
    try {
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

      return result;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new QuestionRepository();
