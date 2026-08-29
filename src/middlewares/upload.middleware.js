import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../errors/custom.error.js';
import { EErrors } from '../errors/enum.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/documents';
    if (file.fieldname === 'proof') {
      folder = 'uploads/proofs';
    }

    try {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    } catch (error) {
      cb(error, folder);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      CustomError.createError({
        name: 'InvalidFileTypeError',
        cause: `El formato de archivo ${file.mimetype} no está permitido.`,
        message: 'Tipo de archivo no permitido. Solo se aceptan JPG, PNG, WEBP y PDF.',
        code: EErrors.INVALID_TYPES,
        statusCode: 400
      }),
      false
    );
  }
};

export const uploader = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // Límite de 5 MB
  }
});