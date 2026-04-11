import { createError } from "../utils/http_error.js";
import UserRepository from "./user.repository.js";

class UserService {
  async findall(page, limit) {
    const skip = (page - 1) * limit;
    const users = await UserRepository.findAll(skip, limit);

    if (!users || users.length === 0) {
      return {
        total: users.total,
        page,
        limit,
        totalPages: Math.ceil(users.total / limit),
        data: [],
      };
    }

    return {
      total: users.total,
      page,
      limit,
      totalPages: Math.ceil(users.total / limit),
      data: users.users,
    };
  }
  async findone(where) {
    const find = await UserRepository.findOne(where);

    if (!find) {
      throw createError("Failed showwing user data!", "NOT_FOUND");
    }

    return find;
  }
  async update(id, data) {
    const updt = await UserRepository.update(id, data);

    if (!updt) {
      throw createError("Failed updating user data!", "BAD_REQUEST");
    }

    return updt;
  }
  async delete(id) {
    const delt = await UserRepository.delete(id);

    if (!delt) {
      throw createError("Failed deleting user data!", "BAD_REQUEST");
    }

    return `User woth id ${id} has been deleted`;
  }
}

export default new UserService();
