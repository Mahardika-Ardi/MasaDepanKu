import ProfileService from "./profile.service.js";

class ProfileController {
  async findone(req, res) {
    try {
      const result = await ProfileService.findone(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Successfully generating questions!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to generating questions",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new ProfileController();
