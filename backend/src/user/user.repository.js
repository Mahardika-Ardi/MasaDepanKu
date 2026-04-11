import prisma from "../config/prisma.js";
import prismaErrors from "../utils/prisma_errors.js";

class UserRepository {
  async findAll(skip, limit) {
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

      return { users, total };
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async findOne(where) {
    try {
      const find = await prisma.users.findFirst({
        where,
        select: { id: true, name: true, email: true, role: true },
      });

      return find;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async update(id, data) {
    try {
      const updt = await prisma.users.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true },
      });

      return updt;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async delete(id) {
    try {
      const delt = await prisma.users.delete({ where: { id } });

      return delt;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new UserRepository();
