import { sendError } from "../utils/http_error.js";
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
      return sendError(res, error, "Failed showing session");
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
      return sendError(res, error, "Failed finishing test session");
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
      return sendError(res, error, "Failed canceling test session");
    }
  }
}

export default new TestsessionController();
