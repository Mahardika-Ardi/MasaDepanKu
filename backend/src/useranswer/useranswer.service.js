import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class UseranswerService {
  async create(data) {
    try {
      await prisma.users.create();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async findall() {
    try {
      // await prisma.users.findMany();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async findone(id) {
    try {
      // await prisma.users.findFirst();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async update(id, data) {
    try {
      // await prisma.users.update();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async delete(id) {
    try {
      // await prisma.users.delete();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new UseranswerService();
