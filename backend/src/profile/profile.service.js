import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

const normalizeScores = (scores) => ({
  bahasa_indonesia: scores?.bahasa_indonesia ?? "",
  bahasa_inggris: scores?.bahasa_inggris ?? "",
  matematika: scores?.matematika ?? "",
  konsentrasi_keahlian: scores?.konsentrasi_keahlian ?? "",
});

class ProfileService {
  async findone(data) {
    try {
      const [findUser, findPhoto, findProfileDetail] = await prisma.$transaction([
        prisma.users.findUnique({ where: { id: data } }),
        prisma.photoProfile.findFirst({ where: { user_id: data } }),
        prisma.profilDetail.findFirst({ where: { user_id: data } }),
      ]);

      if (!findUser || !findPhoto || !findProfileDetail) {
        throw new Error({
          message: "Failed showing profil detail!",
          code: "BAD_REQUEST",
        });
      }

      return {
        user: {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
        },
        photo_path: findPhoto?.file ?? null,
        profil_detail: {
          first_name: findProfileDetail.first_name ?? "",
          last_name: findProfileDetail.last_name ?? "",
          motto: findProfileDetail.motto ?? "",
          country: findProfileDetail.country ?? "",
          city: findProfileDetail.city ?? "",
          jurusan: findProfileDetail.jurusan ?? "",
          scores: normalizeScores(findProfileDetail.raport_score),
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
      const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();

      const updt = await prisma.$transaction(async (tx) => {
        if (fullName) {
          await tx.users.update({
            where: { id: Number(id) },
            data: { name: fullName },
          });
        }

        await tx.profilDetail.update({
          where: { user_id: Number(id) },
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            motto: data.motto,
            country: data.country,
            city: data.city,
            raport_score: data.scores,
          },
        });

        const [findUser, findPhoto, findProfileDetail] = await Promise.all([
          tx.users.findUnique({ where: { id: Number(id) } }),
          tx.photoProfile.findFirst({ where: { user_id: Number(id) } }),
          tx.profilDetail.findFirst({ where: { user_id: Number(id) } }),
        ]);

        return {
          user: {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
          },
          photo_path: findPhoto?.file ?? null,
          profil_detail: {
            first_name: findProfileDetail.first_name ?? "",
            last_name: findProfileDetail.last_name ?? "",
            motto: findProfileDetail.motto ?? "",
            country: findProfileDetail.country ?? "",
            city: findProfileDetail.city ?? "",
            jurusan: findProfileDetail.jurusan ?? "",
            scores: normalizeScores(findProfileDetail.raport_score),
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
