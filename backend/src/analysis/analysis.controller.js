import { AnalysisCreateDto } from "./dto/analysis_create.dto.js";
  import { AnalysisUpdateDto } from "./dto/analysis_update.dto.js";
  import AnalysisService from "./analysis.service.js";
  
  class AnalysisController {
    async create(req, res) {
      try {
        const validated = AnalysisCreateDto.parse(req.body);
        const result = await AnalysisService.register(validated);
  
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
        const result = await AnalysisService.register(req.body);
  
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
        const result = await AnalysisService.register(req.body);
  
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
        const validated = AnalysisUpdateDto.parse(req.body);
        const result = await AnalysisService.register(validated);
  
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
        const result = await AnalysisService.register(req.body);
  
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
  
  export default new AnalysisController();
