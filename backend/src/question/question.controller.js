import { sendError } from "../utils/http_error.utils.js";
import QuestionService from "./question.service.js";

class QuestionController {
  async create(req, res) {
    try {
      const result = await QuestionService.create(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Successfully generating questions!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed generating question");
    }
  }
}

export default new QuestionController();
