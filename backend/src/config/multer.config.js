import multer from "multer";
import path from "path";
import { v7 as uuidV7 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, callbak) => {
    callbak(null, "uploads/");
  },

  filename: (req, file, callbak) => {
    const ext = path.extname(file.originalname);
    callbak(null, uuidV7 + ext);
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
    callbak(new Error("Only images typed file are allowed"), false);
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
