import { sendError } from "../utils/http_error.utils.js";
import { UserUpdateDto } from "./dto/user_update.dto.js";
import UserService from "./user.service.js";

class UserController {
  async findall(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
      const result = await UserService.findall(page, limit);

      res.status(200).json({
        Success: true,
        Message: "Successfully Get User Data!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed to get user data");
    }
  }
  async findone(req, res) {
    const name = req.query.name;
    const email = req.query.email;

    let where = {};

    if (name) where.name = name;
    if (email) where.email = email;

    try {
      const result = await UserService.findone(where);

      res.status(200).json({
        Success: true,
        Message: "Successfully Get User Data!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed to get user data");
    }
  }
  async update(req, res) {
    const id = req.user.id;

    try {
      const validated = UserUpdateDto.parse(req.body);
      const result = await UserService.update(id, validated);

      res.status(201).json({
        Success: true,
        Message: "Successfully updating user data!",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed updating data");
    }
  }
  async delete(req, res) {
    const id = req.user.id;

    try {
      const result = await UserService.delete(id);

      res.status(201).json({
        Success: true,
        Message: "Seccussfully deleting account",
        Information: result,
        Error: null,
      });
    } catch (error) {
      return sendError(res, error, "Failed deleting account");
    }
  }
}

export default new UserController();
