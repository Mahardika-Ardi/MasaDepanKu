import UpdateUsersDto from "../dto/users/update_users.dto.js";
import UserService from "../services/users.service.js";

class UserController {
  async findall(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await UserService.findall(page, limit);

      res.status(200).json({
        Success: true,
        Message: "Successfully Get User Data!",
        Information: result,
        Error: null,
      });
      console.log(result);
    } catch (error) {
      res.status(500).json({
        Success: false,
        Message:
          `Error -> ${error.message}` || "Error -> Failed to Get User Data!",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
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
      res.status(500).json({
        Success: false,
        Message:
          `Error -> ${error.message}` || "Error -> Failed to Get User Data!",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
  async update(req, res) {
    const id = Number(req.params.id);
    try {
      const validated = UpdateUsersDto.parse(req.body);
      const result = await UserService.update(id, validated);

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
          `Error -> ${error.message}` || "Error -> Failed to Get User Data!",
        Information: null,
        Error: error.code || "BAD_REQUEST",
      });
    }
  }
  async delete(req, res) {
    const id = Number(req.params.id);
    try {
      const result = await UserService.delete(id);

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
}

export default new UserController();
