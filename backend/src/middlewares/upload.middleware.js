import { multerConfig, multersConfig } from "../config/multer.config";

export const uploadSingleImage = multerConfig.single("image");
export const uploadMultipleFiles = multersConfig.array("images", 5);
