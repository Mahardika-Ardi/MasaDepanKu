import { CreateQuestionDto } from "../dto/question/create_question.js";
import questionService from "../services/question.service.js";

class QuestionContoller {
  async create(req, res) {
    try {
      const validated = CreateQuestionDto.parse(req.body);
      const result = questionService.create(validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully Get User Data!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to Register Users",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new QuestionContoller();
