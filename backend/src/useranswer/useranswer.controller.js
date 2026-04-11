import { sendError } from "../utils/http_error.js";
import { UseranswerCreateDto } from "./dto/useranswer_create.dto.js";
import UseranswerService from "./useranswer.service.js";

class UseranswerController {
  async create(req, res) {
    try {
      const validated = UseranswerCreateDto.parse(req.body);
      const result = await UseranswerService.create(validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully submit answer",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed submitting answer");
    }
  }

  async findall(req, res) {
    try {
      const result = await UseranswerService.findall(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Succesfully showing question",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed showing answer");
    }
  }
}

export default new UseranswerController();
