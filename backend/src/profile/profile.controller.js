import fs from "fs";
import { ProfileUpdateDto } from "./dto/profile_update.dto.js";
import ProfileService from "./profile.service.js";

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
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to get profile",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
  async update(req, res) {
    const data = {
      file: req.file.filename,
      jurusan: req.body.jurusan,
      raport: req.body.raport ? JSON.parse(req.body.raport) : null,
    };

    try {
      const validated = ProfileUpdateDto.parse(data);

      if (!validated) {
        res.status(500).json({
          Message:
            "Error -> Data type is not valid or data blak ( undifined / null )",
          Information: null,
        });
      }

      const result = await ProfileService.update(req.user.id, validated);

      res.status(200).json({
        Success: true,
        Message: "Successfully updating profile!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to updating profile",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new ProfileController();
