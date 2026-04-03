import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class UseranswerService {
  normalizeAnswers(answers) {
    return answers.map((item) => {
      if (typeof item === "number") {
        return item;
      }

      return item.value;
    });
  }

  async create(userId, data) {
    try {
      const normalizedAnswers = this.normalizeAnswers(data.answers);

      const result = await prisma.$transaction(async (tx) => {
        const questionGroup = await tx.groupQuestion.findFirst({
          where: {
            id: data.group_question_id,
            user_id: userId,
          },
        });

        if (!questionGroup) {
          throw {
            code: "NOT_FOUND",
            message: "Question group not found for this user",
          };
        }

        const existingAnswerGroup = await tx.userAnswerGroup.findFirst({
          where: { user_id: userId },
        });

        let answerGroup = existingAnswerGroup;

        if (answerGroup) {
          await tx.userAnswer.deleteMany({ where: { group_id: answerGroup.id } });
        } else {
          answerGroup = await tx.userAnswerGroup.create({
            data: { user_id: userId },
          });
        }

        await tx.userAnswer.createMany({
          data: normalizedAnswers.map((value) => ({
            group_id: answerGroup.id,
            value,
          })),
        });

        return {
          user_id: userId,
          group_question_id: data.group_question_id,
          total_answers: normalizedAnswers.length,
          overwritten: Boolean(existingAnswerGroup),
        };
      });

      return result;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async findLatest(userId) {
    try {
      const answerGroup = await prisma.userAnswerGroup.findFirst({
        where: { user_id: userId },
        include: {
          userAnswers: {
            orderBy: { id: "asc" },
          },
        },
      });

      if (!answerGroup) {
        return {
          user_id: userId,
          answers: [],
          total_answers: 0,
        };
      }

      return {
        user_id: userId,
        answer_group_id: answerGroup.id,
        answers: answerGroup.userAnswers.map((item) => item.value),
        total_answers: answerGroup.userAnswers.length,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new UseranswerService();
