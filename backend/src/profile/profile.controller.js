import { ProfileUpdateDto } from "./dto/profile_update.dto.js";
import ProfileService from "./profile.service.js";
import cloudinary from "../config/cloudinary.config.js";
import { sendError } from "../utils/http_error.utils.js";

class ProfileController {
  async findone(req, res) {
    try {
      const result = await ProfileService.findone(req.user.id);

      res.status(200).json({
        Success: true,
        Message: "Successfully get profile!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed showing user profile");
    }
  }

  async update(req, res) {
    try {
      const data = {
        file: {
          path: req.file.path,
          filename: req.file.filename,
        },
        jurusan: req.body.jurusan,
        raport: req.body.raport ? JSON.parse(req.body.raport) : undefined,
      };

      const validated = ProfileUpdateDto.parse(data);
      const result = await ProfileService.update(req.user.id, validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully updating profile!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      if (req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }

      return sendError(res, error, "Failed updating user profile");
    }
  }
}

export default new ProfileController();
