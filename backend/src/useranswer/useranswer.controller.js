import { UseranswerCreateDto } from "./dto/useranswer_create.dto.js";
import UseranswerService from "./useranswer.service.js";

class UseranswerController {
  async create(req, res) {
    try {
      const validated = UseranswerCreateDto.parse(req.body);
      const result = await UseranswerService.create(req.user.id, validated);

      res.status(200).json({
        Success: true,
        Message: "User answers submitted successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error ->",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }

  async findLatest(req, res) {
    try {
      const result = await UseranswerService.findLatest(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Latest user answers fetched successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error ->",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new UseranswerController();
