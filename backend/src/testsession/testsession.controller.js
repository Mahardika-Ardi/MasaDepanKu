import TestsessionService from "./testsession.service.js";

class TestsessionController {
  async find(req, res) {
    try {
      const result = await TestsessionService.find(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Sucessfully showing session",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed showing session",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
  async finish(req, res) {
    try {
      const result = await TestsessionService.finish(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Sucessfully finishing test session",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed finishing test session",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
  async cancel(req, res) {
    try {
      const result = await TestsessionService.cancel(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Sucessfully canceling test session",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed canceling test session",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new TestsessionController();
