import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { createToken } from "../utils/generate_token.js";
import { createError } from "../utils/http_error.js";
import AuthRepository from "./auth.repository.js";

class AuthService {
  async register(data) {
    const hashed = await hashPassword(data.password);
    const add = await AuthRepository.create(data, hashed);

    if (!add) {
      throw createError("Register Failed", "BAD_REQUEST");
    }

    return add;
  }

  async login(data) {
    const find = await AuthRepository.findUser(data);

    if (!find) {
      throw createError("LogIn failed invalid credential", "NOT_FOUND");
    }

    const compare = await comparePassword(data.password, find.password);

    if (!compare) {
      throw createError("LogIn failed invalid credential", "UNAUTHORIZED");
    }

    const payload = {
      id: find.id,
      name: find.name,
      email: find.email,
      role: find.role,
    };
    const token = createToken(payload);

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      token,
    };
  }
}

export default new AuthService();
