import { UseranswerCreateDto } from "./dto/useranswer_create.dto.js";
import { UseranswerUpdateDto } from "./dto/useranswer_update.dto.js";
import UseranswerService from "./useranswer.service.js";

class UseranswerController {
  async create(req, res) {
    try {
      const validated = UseranswerCreateDto.parse(req.body);
      const result = await UseranswerService.register(validated);

      res.status(200).json({
        Success: true,
        Message: "",
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
  async findall(req, res) {
    try {
      const result = await UseranswerService.register(req.body);

      res.status(200).json({
        Success: true,
        Message: "",
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
  async findone(req, res) {
    try {
      const result = await UseranswerService.register(req.body);

      res.status(200).json({
        Success: true,
        Message: "",
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
  async update(req, res) {
    try {
      const validated = UseranswerUpdateDto.parse(req.body);
      const result = await UseranswerService.register(validated);

      res.status(200).json({
        Success: true,
        Message: "",
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
  async delete(req, res) {
    try {
      const result = await UseranswerService.register(req.body);

      res.status(200).json({
        Success: true,
        Message: "",
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
