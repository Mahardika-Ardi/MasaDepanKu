import { multerConfig, multersConfig } from "../config/multer.config.js";

export const uploadSingleImage = multerConfig.single("file");
export const uploadMultipleFiles = multersConfig.array("file", 5);
