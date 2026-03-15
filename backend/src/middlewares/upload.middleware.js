import { multerConfig } from "../config/multer.config";

export const uploadSingleImage = multerConfig.single("image");
export const uploadMultipleFiles = multerConfig.array("images", 5);
