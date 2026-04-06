import { AuthDto } from "./dto/auth.dto.js";
import AuthService from "./auth.service.js";
import { UserCreateDto } from "../user/dto/user_create.dto.js";

class AuthController {
  async register(req, res) {
    try {
      const validated = UserCreateDto.parse(req.body);

      if (!validated) {
        res.status(500).json({
          Message:
            "Error -> Data type is not valid or data blak ( undifined / null )",
          Information: null,
        });
      }

      const result = await AuthService.register(validated);

      res.status(201).json({
        Success: true,
        Message: "Register successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> Failed to Register Users",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }

  async login(req, res) {
    try {
      const validated = AuthDto.parse(req.body);

      if (!validated) {
        res.status(500).json({
          Message:
            "Error -> Data type is not valid or data blak ( undifined / null )",
          Information: null,
        });
      }

      const result = await AuthService.login(validated);

      res.status(200).json({
        Success: true,
        Message: "LogIn Successfully!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message: "Error -> LogIn Failed!",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
}

export default new AuthController();
