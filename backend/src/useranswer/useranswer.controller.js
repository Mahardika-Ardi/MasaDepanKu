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
      res.status(500).json({
        Success: false,
        Message: "Error -> failed answering question",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
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
      res.status(500).json({
        Success: false,
        Message: "Error -> failed showing question",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new UseranswerController();
