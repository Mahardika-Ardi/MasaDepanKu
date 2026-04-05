import cloudinary from "../config/cloudinary.config.js";
import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class ProfileService {
  async findone(id) {
    try {
      const findProfile = await prisma.users.findFirst({
        where: { id },
        select: {
          photoProfiles: { select: { file: true } },
          profilDetail: { select: { jurusan: true, raportScore: true } },
        },
      });

      if (!findProfile) {
        throw new Error("Failed getting profile!");
      }

      return {
        photo_path: findProfile.photoProfiles.file,
        profil_detail: {
          jurusan: findProfile.profilDetail.jurusan,
          raport: findProfile.profilDetail.raportScore,
        },
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }

  async update(id, data) {
    const secureURL = data.file.path;
    const publicId = data.file.filename;
    console.log(publicId);

    try {
      const existingPhotoProfile = await prisma.photoProfile.findFirst({
        where: { userId: id },
      });

      if (!existingPhotoProfile) {
        throw new Error("Failed updating profil!");
      }

      const updtusr = await prisma.users.update({
        where: { id },
        data: {
          photoProfiles: {
            update: { file: secureURL, publicId: publicId },
          },
          profilDetail: {
            update: { jurusan: data.jurusan, raportScore: data.raport },
          },
        },
        select: {
          photoProfiles: { select: { file: true } },
          profilDetail: { select: { jurusan: true, raportScore: true } },
        },
      });

      if (existingPhotoProfile && existingPhotoProfile.publicId) {
        await cloudinary.uploader.destroy(existingPhotoProfile.publicId);
      }

      if (!updtusr) {
        throw {
          message: "Failed updating profil!",
          code: "BAD_REQUEST",
        };
      }

      return {
        photo_path: updtusr.photoProfiles.file,
        profil_detail: {
          jurusan: updtusr.profilDetail.jurusan,
          raport: updtusr.profilDetail.raportScore,
        },
      };
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new ProfileService();
