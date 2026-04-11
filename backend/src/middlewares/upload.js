import {
  multerConfig,
  multersConfig,
  multerConfigCloudinaryImage,
  multersConfigCloudinaryDocument,
} from "../config/multer.js";

export const uploadSingleImage = multerConfig.single("file");
export const uploadMultipleFiles = multersConfig.array("file", 5);
export const uploadSingleImageCloudinary =
  multerConfigCloudinaryImage.single("file");
export const uploadMultipleFilesCloudinary =
  multersConfigCloudinaryDocument.array("file", 5);
