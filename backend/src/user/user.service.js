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
          message: "Failed Getting User!",
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
  async update(id, data) {
    try {
      const updt = await prisma.$transaction([
        prisma.users.update({ where: { id }, data }),
        prisma.users.findFirst({ where: { id } }),
      ]);

      if (!updt) {
        throw new Error({
          message: "Failed Updating Users Data!",
          code: "BAD_REQUEST",
        });
      }

      return {
        id: updt.id,
        name: updt.name,
        email: updt.email,
        role: updt.role,
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async delete(id) {
    try {
      const findGroupQuestion = await prisma.groupQuestion.findFirst({
        where: { user_id: id },
      });

      if (!findGroupQuestion) {
        throw {
          message: "Failed Finding User!",
          code: "BAD_REQUEST",
        };
      }

      const delt = await prisma.$transaction([
        prisma.profilDetail.delete({ where: { user_id: id } }),
        prisma.photoProfile.delete({ where: { user_id: id } }),
        prisma.groupQuestion.delete({ where: { user_id: id } }),
        prisma.question.delete({ where: { group_id: findGroupQuestion.id } }),
        prisma.users.delete({ where: { id } }),
      ]);

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
