import prisma from "../config/prisma.config";
import prismaErrors from "../utils/prisma_errors.utils.js";

class ProfilService {
  async findone(data) {
    try {
      const find = await prisma.$transaction(async (tx) => {
        const findPhoto = await tx.photoProfile.findFirst({
          where: { user_id: data.user_id },
        });
        const findProfilDetail = await tx.profilDetail.findFirst({
          where: { user_id: data.user_id },
        });

        return {
          photo_path: findPhoto.file,
          profil_detail: {
            jurusan: findProfilDetail.jurusan,
            raport: findProfilDetail.raport_score,
          },
        };
      });

      if (!find) {
        throw new Error({
          message: "Failed showing profil detail!",
          code: "BAD_REQUEST",
        });
      }

      return find;
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async update(data) {}
}

export default new ProfilService();
