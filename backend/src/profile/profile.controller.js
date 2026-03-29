import { ProfileCreateDto } from "./dto/profile_create.dto.js";
  import { ProfileUpdateDto } from "./dto/profile_update.dto.js";
  import ProfileService from "./profile.service.js";
  
  class ProfileController {
    async create(req, res) {
      try {
        const validated = ProfileCreateDto.parse(req.body);
        const result = await ProfileService.register(validated);
  
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
        const result = await ProfileService.register(req.body);
  
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
        const result = await ProfileService.register(req.body);
  
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
        const validated = ProfileUpdateDto.parse(req.body);
        const result = await ProfileService.register(validated);
  
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
        const result = await ProfileService.register(req.body);
  
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
  
  export default new ProfileController();
