import { UserService } from "../services/users.service.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";

const userService = new UserService();
const ALLOWED_DOC_TYPES = ["DNI", "LICENSE", "PASSPORT", "TAX_ID", "PROOF_OF_ADDRESS"];

export class UserController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getAllUsers({ page, limit });

      const docs = result.docs || result;
      const totalRecords = result.totalDocs || (Array.isArray(result) ? result.length : 0);
      const totalPages = result.totalPages || Math.ceil(totalRecords / limit) || 1;

      res.status(200).json({ 
        status: "success", 
        payload: docs,
        totalRecords,
        totalPages,
        page,
        limit
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.uid);
      res.status(200).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.uid, req.body);
      res.status(200).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = await userService.deleteUser(req.params.uid);
      res.status(200).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  static async uploadDocuments(req, res, next) {
    try {
      const { uid } = req.params;
      const { docType } = req.body;

      if (!req.file) {
        CustomError.createError({
          name: "MissingFileError",
          cause: "No se ha adjuntado ningún archivo.",
          message: "El archivo es requerido para esta operación.",
          code: EErrors.INVALID_TYPES_ERROR,
          statusCode: 400
        });
      }

      if (!docType) {
        CustomError.createError({
          name: "MissingDocTypeError",
          cause: "Campo docType no especificado.",
          message: "Debe especificar el tipo de documento (ej. DNI, LICENSE, PASSPORT, TAX_ID, PROOF_OF_ADDRESS).",
          code: EErrors.INVALID_TYPES_ERROR,
          statusCode: 400
        });
      }

      if (!ALLOWED_DOC_TYPES.includes(docType)) {
        CustomError.createError({
          name: "InvalidDocTypeError",
          cause: `El tipo de documento '${docType}' no es válido.`,
          message: `Tipo de documento no permitido. Tipos válidos: ${ALLOWED_DOC_TYPES.join(", ")}`,
          code: EErrors.INVALID_TYPES_ERROR,
          statusCode: 400
        });
      }

      const documentMeta = {
        name: req.file.originalname,
        filename: req.file.filename,
        reference: req.file.path,
        docType,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      };

      await userService.addDocument(uid, documentMeta);

      logger.info(`Documento '${docType}' cargado exitosamente para el usuario ${uid}`);

      res.status(200).json({
        status: "success",
        message: "Documento subido y asociado correctamente",
        payload: documentMeta
      });
    } catch (error) {
      next(error);
    }
  }
}