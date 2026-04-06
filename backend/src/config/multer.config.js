import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";
import { v7 as uuidV7 } from "uuid";
import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "masadepanku/images",
    allowed_formats: ["jpeg", "png", "jpg", "webp", "gif"],
    resource_type: "image",
  },
});

const mixedStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  // eslint-disable-next-line no-unused-vars
  params: async (req, file) => {
    return {
      folder: "masadepanku/documents",
      resource_type: "auto",
    };
  },
});

const storage = multer.diskStorage({
  destination: (req, file, callbak) => {
    callbak(null, uploadDir);
  },

  filename: (req, file, callbak) => {
    const ext = path.extname(file.originalname);
    callbak(null, `${uuidV7()}${ext}`);
  },
});

const fileFilter = (req, file, callbak) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callbak(null, true);
  } else {
    callbak(new Error("Only images typed file are allowed"), false);
  }
};

const filesFilter = (req, file, callbak) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain",
    "text/markdown",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callbak(null, true);
  } else {
    callbak(new Error("Only some typed file are allowed"), false);
  }
};

export const multerConfig = multer({
  storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const multersConfig = multer({
  storage,
  fileFilter: filesFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const multerConfigCloudinaryImage = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const multersConfigCloudinaryDocument = multer({
  storage: mixedStorage,
  fileFilter: filesFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
