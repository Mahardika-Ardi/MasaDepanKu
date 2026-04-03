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
      const currentId = Number(id);

      const [findUser, findPhoto, findProfileDetail] = await prisma.$transaction([
        prisma.users.findUnique({ where: { id: currentId } }),
        prisma.photoProfile.findFirst({ where: { user_id: currentId } }),
        prisma.profilDetail.findFirst({ where: { user_id: currentId } }),
      ]);

      const currentScores = normalizeScores(findProfileDetail?.raport_score);
      const mergedScores = {
        ...currentScores,
        ...Object.fromEntries(
          Object.entries(data.scores ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ""),
        ),
      };

      const profileUpdateData = {
        ...(data.first_name !== undefined ? { first_name: data.first_name } : {}),
        ...(data.last_name !== undefined ? { last_name: data.last_name } : {}),
        ...(data.motto !== undefined ? { motto: data.motto } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
      };

      if (Object.keys(data.scores ?? {}).length > 0) {
        profileUpdateData.raport_score = mergedScores;
      }

      const fullName = [
        data.first_name !== undefined ? data.first_name : findProfileDetail?.first_name,
        data.last_name !== undefined ? data.last_name : findProfileDetail?.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      const updt = await prisma.$transaction(async (tx) => {
        if (fullName && fullName !== findUser?.name) {
          await tx.users.update({
            where: { id: currentId },
            data: { name: fullName },
          });
        }

        if (Object.keys(profileUpdateData).length > 0) {
          await tx.profilDetail.update({
            where: { user_id: currentId },
            data: profileUpdateData,
          });
        }

        const [updatedUser, updatedPhoto, updatedProfileDetail] = await Promise.all([
          tx.users.findUnique({ where: { id: currentId } }),
          tx.photoProfile.findFirst({ where: { user_id: currentId } }),
          tx.profilDetail.findFirst({ where: { user_id: currentId } }),
        ]);

        return {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
          },
          photo_path: updatedPhoto?.file ?? null,
          profil_detail: {
            first_name: updatedProfileDetail.first_name ?? "",
            last_name: updatedProfileDetail.last_name ?? "",
            motto: updatedProfileDetail.motto ?? "",
            country: updatedProfileDetail.country ?? "",
            city: updatedProfileDetail.city ?? "",
            jurusan: updatedProfileDetail.jurusan ?? "",
            scores: normalizeScores(updatedProfileDetail.raport_score),
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
