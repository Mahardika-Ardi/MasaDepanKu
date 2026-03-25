import AuthDto from "../dto/auth/auth.dto.js";
import { CreateUsersDto } from "../dto/users/create_users.dto.js";
import authService from "../services/auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const validated = CreateUsersDto.parse(req.body);
      const result = await authService.register(validated);

      res.status(201).json({
        Success: true,
        Message: "Register successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message:
          `Error -> ${error.message}` || "Error -> Failed to Register Users",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }

  async login(req, res) {
    try {
      const validated = AuthDto.parse(req.body);
      const result = await authService.login(validated);

      res.status(200).json({
        Success: true,
        Message: "LogIn Successfully!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: `Error -> ${error.message}` || "Error -> LogIn Failed!",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new AuthController();
