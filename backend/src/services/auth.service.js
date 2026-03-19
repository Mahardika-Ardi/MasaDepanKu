import prisma from "../config/prisma.config.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils.js";
import { createToken } from "../utils/generate_token.utils.js";
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
        },
      });

      if (!add) {
        throw new Error({
          message: "Failed Creating Users!",
          code: "BAD_REQUEST",
        });
      }

      return {
        id: add.id,
        name: add.name,
        email: add.email,
        role: add.role,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async login(data) {
    try {
      const find = await prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!find) {
        throw new Error({
          message: "LogIn failed!, try again",
          code: "BAD_REQUEST",
        });
      }

      const compare = await comparePassword(data.password, find.password);

      if (!compare) {
        throw new Error({
          message: "Failed Creating Users!",
          code: "BAD_REQUEST",
        });
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
      throw error || prismaError;
    }
  }
}

export default new AuthService();
