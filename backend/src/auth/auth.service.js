import prisma from "../config/prisma.config.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils.js";
import { createToken } from "../utils/generate_token.utils.js";
import { createError } from "../utils/http_error.utils.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class AuthService {
  async register(data) {
    const hashed = await hashPassword(data.password);

    try {
      const add = await prisma.users.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashed,
          photoProfiles: { create: {} },
          profilDetail: { create: {} },
        },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!add) {
        throw createError("Register Failed", "BAD_REQUEST");
      }

      return add;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }

  async login(data) {
    try {
      const find = await prisma.users.findUnique({
        where: { email: data.email },
      });

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
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
}

export default new AuthService();
