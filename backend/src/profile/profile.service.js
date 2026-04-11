import cloudinary from "../config/cloudinary.js";
import { createError } from "../utils/http_error.js";
import ProfileRepository from "./profile.repository.js";

class ProfileService {
  async findone(id) {
    const findProfile = await ProfileRepository.findOne(id);

    if (!findProfile) {
      throw createError("Failed showing profil data", "NOT_FOUND");
    }

    return findProfile;
  }

  async update(id, data) {
    const existingPhotoProfile = await ProfileRepository.findPhoto(id);

    if (!existingPhotoProfile) {
      throw createError("Failed updating profile", "NOT_FOUND");
    }

    const updtusr = await ProfileRepository.update(id, data);

    if (existingPhotoProfile && existingPhotoProfile.publicId) {
      await cloudinary.uploader.destroy(existingPhotoProfile.publicId);
    }
    if (!updtusr) {
      throw createError("Failed updating profile", "BAD_REQUEST");
    }

    return updtusr;
  }
}

export default new ProfileService();
