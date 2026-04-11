import prisma from "../config/prisma.js";
import prismaErrors from "../utils/prisma_errors.js";

class ProfileRepository {
  async findOne(id) {
    try {
      const findProfile = await prisma.users.findFirst({
        where: { id },
        select: {
          photoProfiles: { select: { file: true } },
          profilDetail: { select: { jurusan: true, raportScore: true } },
        },
      });

      return findProfile;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async findPhoto(id) {
    try {
      const existingPhotoProfile = await prisma.photoProfile.findFirst({
        where: { userId: id },
      });

      return existingPhotoProfile;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
  async update(id, data) {
    try {
      const updtusr = await prisma.users.update({
        where: { id },
        data: {
          photoProfiles: {
            update: { file: data.file.path, publicId: data.file.filename },
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

      return updtusr;
    } catch (error) {
      throw prismaErrors(error) || error;
    }
  }
}

export default new ProfileRepository();
