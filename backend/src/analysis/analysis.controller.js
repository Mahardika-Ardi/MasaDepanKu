import AnalysisService from "./analysis.service.js";

class AnalysisController {
  async analysis(req, res) {
    try {
      const result = await AnalysisService.analysis(req.user.id);
      console.log(result);
      

      res.status(200).json({
        Success: true,
        Message: "Successfully analiting user ",
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
