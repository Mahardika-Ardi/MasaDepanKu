import prisma from "../config/prisma.config.js";
import AiService from "./ai.service.js";

class QuestionService {
  async create(data) {
    try {
      const addGroupQuestion = await prisma.groupQuestion.create({
        data: { user_id: data.user_id },
      });

      const addQuestion = (await AiService.GenerateQuestion()).forEach(
        async (x) => {
          await prisma.question.create({
            data: { group_id: addGroupQuestion.id, ...x },
          });
        },
      );

      console.log(addQuestion);

      return {
        generated_by: addGroupQuestion.user_id,
        group_question_id: addGroupQuestion.id,
        question: addGroupQuestion,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new QuestionService();
