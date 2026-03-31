import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class ProfileService {
  async findone(data) {
    try {
      const [findPhoto, findProfileDetail] = await prisma.$transaction([
        prisma.photoProfile.findFirst({ where: { user_id: data } }),
        prisma.profilDetail.findFirst({ where: { user_id: data } }),
      ]);

      if (!findPhoto && findProfileDetail) {
        throw new Error({
          message: "Failed showing profil detail!",
          code: "BAD_REQUEST",
        });
      }

      return {
        photo_path: findPhoto.file,
        profil_detail: {
          jurusan: findProfileDetail.jurusan,
          raport: findProfileDetail.raport_score,
        },
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async update(id, data) {
    try {
      const updt = await prisma.$transaction(async (tx) => {
        await tx.photoProfile.update({
          where: { user_id: Number(id) },
          data: { file: data.file },
        });
        await tx.profilDetail.update({
          where: { user_id: Number(id) },
          data: { jurusan: data.jurusan, raport_score: data.raport },
        });

        const [findPhoto, findProfileDetail] = await Promise.all([
          await tx.photoProfile.findFirst({ where: { user_id: Number(id) } }),
          await tx.profilDetail.findFirst({ where: { user_id: Number(id) } }),
        ]);

        return {
          photo_path: findPhoto.file,
          profil_detail: {
            jurusan: findProfileDetail.jurusan,
            raport: findProfileDetail.raport_score,
          },
        };
      });

      if (!updt) {
        throw new Error({
          message: "Failed updating profil!",
          code: "BAD_REQUEST",
        });
      }

      return updt;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new ProfileService();
