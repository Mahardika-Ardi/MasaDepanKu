import prisma from "../config/prisma.config.js";
import { createError } from "../utils/http_error.utils.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class UserService {
  async findall(page, limit) {
    const skip = (page - 1) * limit;
    try {
      const [users, total] = await prisma.$transaction([
        prisma.users.findMany({
          take: limit,
          skip: skip,
          orderBy: { id: "asc" },
          select: { id: true, name: true, email: true, role: true },
        }),
        prisma.users.count(),
      ]);

      if (!users || users.length === 0) {
        return {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          data: [],
        };
      }

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: users,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
  async findone(where) {
    try {
      const find = await prisma.users.findFirst({
        where,
        select: { id: true, name: true, email: true, role: true },
      });

      if (!find) {
        throw createError("Failed showwing user data!", "NOT_FOUND");
      }

      return find;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
  async update(id, data) {
    try {
      const updt = await prisma.users.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true },
      });

      if (!updt) {
        throw createError("Failed updating user data!", "BAD_REQUEST");
      }

      return updt;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
  async delete(id) {
    try {
      const delt = await prisma.users.delete({ where: { id } });

      if (!delt) {
        throw createError("Failed deleting user data!", "BAD_REQUEST");
      }
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw prismaError || error;
    }
  }
}

export default new UserService();
