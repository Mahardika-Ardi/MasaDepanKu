import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class UserService {
  async findall(page, limit) {
    const skip = (page - 1) * limit;
    try {
      const [users, total] = await Promise.all([
        prisma.users.findMany({
          take: limit,
          skip: skip,
          orderBy: { id: "asc" },
        }),
        prisma.users.count(),
      ]);

      if (!users || users.length === 0) {
        throw {
          message: "Failed Getting All User!",
          code: "BAD_REQUEST",
        };
      }

      const userSafe = users.map((x) => {
        return {
          id: x.id,
          name: x.name,
          email: x.email,
          role: x.role,
        };
      });

      console.log({
        data: userSafe,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });

      return {
        data: userSafe,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async findone(where) {
    try {
      const find = await prisma.users.findFirst({ where });

      if (!find) {
        throw {
          message: "Failed Getting All User!",
          code: "BAD_REQUEST",
        };
      }

      return {
        id: find.id,
        name: find.name,
        email: find.email,
        role: find.role,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      throw error || prismaError;
    }
  }
  async update(id, data) {
    try {
      const updt = await prisma.users.update({ where: { id }, data });

      if (!updt) {
        throw new Error({
          message: "Failed Creating Users!",
          code: "BAD_REQUEST",
        });
      }

      const find = await prisma.users.findFirst({ where: { id } });

      if (!find) {
        throw {
          message: "Failed Creating Users!",
          code: "BAD_REQUEST",
        };
      }

      return {
        id: find.id,
        name: find.name,
        email: find.email,
        role: find.role,
      };
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
          message: "Failed Creating Users!",
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
