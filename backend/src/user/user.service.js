import prisma from "../config/prisma.config.js";
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
        throw {
          message: "Failed Getting All User!",
          code: "BAD_REQUEST",
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
      throw error || prismaError;
    }
  }
  async findone(where) {
    try {
      const find = await prisma.users.findFirst({
        where,
        select: { id: true, name: true, email: true, role: true },
      });

      if (!find) {
        throw {
          message: "Failed Getting User!",
          code: "BAD_REQUEST",
        };
      }

      return find;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
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
        throw {
          message: "Failed Updating Users Data!",
          code: "BAD_REQUEST",
        };
      }

      return updt;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async delete(id) {
    try {
      const delt = await prisma.users.delete({ where: { id } });

      if (!delt) {
        throw {
          message: "Failed Deleting User!",
          code: "BAD_REQUEST",
        };
      }
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new UserService();
