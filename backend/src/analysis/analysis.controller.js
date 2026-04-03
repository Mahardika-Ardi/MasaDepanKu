import { AnalysisCreateDto } from "./dto/analysis_create.dto.js";
import AnalysisService from "./analysis.service.js";

class AnalysisController {
  async create(req, res) {
    try {
      const validated = AnalysisCreateDto.parse(req.body || {});
      const result = await AnalysisService.generate(req.user.id, validated);

      res.status(200).json({
        Success: true,
        Message: "Analysis generated successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to generate analysis",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }

  async findLatest(req, res) {
    try {
      const result = await AnalysisService.generate(req.user.id, {});

      res.status(200).json({
        Success: true,
        Message: "Latest analysis generated successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to get latest analysis",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new AnalysisController();
