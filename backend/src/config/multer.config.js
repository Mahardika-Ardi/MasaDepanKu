import multer from "multer";
import path from "path";
import { v7 as uuidV7 } from "uuid";
import fs from "fs";
import { fileURLToPath } from "url";

const currentfile = fileURLToPath(import.meta.url);
const currentdir = path.dirname(currentfile);
const uploadDir = path.join(currentdir, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, callbak) => {
    callbak(null, uploadDir);
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
