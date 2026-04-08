import { AuthDto } from "./dto/auth.dto.js";
import AuthService from "./auth.service.js";
import { UserCreateDto } from "../user/dto/user_create.dto.js";
import { sendError } from "../utils/http_error.utils.js";

class AuthController {
  async register(req, res) {
    try {
      const validated = UserCreateDto.parse(req.body);
      const result = await AuthService.register(validated);

      res.status(201).json({
        Success: true,
        Message: "Register successfully",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed creating user");
    }
  }

  async login(req, res) {
    try {
      const validated = AuthDto.parse(req.body);
      const result = await AuthService.login(validated);

      res.status(200).json({
        Success: true,
        Message: "LogIn Successfully!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "LogIn Failed!");
    }
  }
}

export default new AuthController();
