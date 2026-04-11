import { sendError } from "../utils/http_error.js";
import AnalysisService from "./analysis.service.js";

class AnalysisController {
  async analysis(req, res) {
    try {
      const result = await AnalysisService.analysis(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Successfully analiting user ",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed to analyze user answers");
    }
  }
}

export default new AnalysisController();
