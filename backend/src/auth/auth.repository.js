import prisma from "../config/prisma.js";
import prismaErrors from "../utils/prisma_errors.js";

class AuthRepository {
  async create(data, hashed) {
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

      return add;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }

  async findUser(data) {
    try {
      const find = await prisma.users.findUnique({
        where: { email: data.email },
      });

      return find;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new AuthRepository();
