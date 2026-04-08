import cloudinary from "../config/cloudinary.config.js";
import prisma from "../config/prisma.config.js";
import { createError } from "../utils/http_error.utils.js";
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
        throw createError("Failed showing profil data", "NOT_FOUND");
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
      throw prismaError || error;
    }
  }

  async update(id, data) {
    const secureURL = data.file.path;
    const publicId = data.file.filename;

    try {
      const existingPhotoProfile = await prisma.photoProfile.findFirst({
        where: { userId: id },
      });

      if (!existingPhotoProfile) {
        throw createError("Failed updating profile", "NOT_FOUND");
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
        throw createError("Failed updating profile", "BAD_REQUEST");
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
      throw prismaError || error;
    }
  }
}

export default new ProfileService();
