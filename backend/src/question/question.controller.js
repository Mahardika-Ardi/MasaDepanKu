import { QuestionCreateDto } from "./dto/question_create.dto.js";
import QuestionService from "./question.service.js";

class QuestionController {
  async create(req, res) {
    const user_id = req.user.id;

    try {
      const validated = QuestionCreateDto.parse({ user_id });

      if (!validated) {
        res.status(500).json({
          Message:
            "Error -> Data type is not valid or data blak ( undifined / null )",
          Information: null,
        });
      }

      const result = await QuestionService.create(validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully generating questions!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to generating questions",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new QuestionController();
