import { ProfileUpdateDto } from "./dto/profile_update.dto.js";
import ProfileService from "./profile.service.js";

class ProfileController {
  async findone(req, res) {
    try {
      const result = await ProfileService.findone(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Successfully get profile data",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to get profile data",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }

  async update(req, res) {
    try {
      const validated = ProfileUpdateDto.parse(req.body);
      const result = await ProfileService.update(req.user.id, validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully update profile data",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to update profile data",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new ProfileController();
