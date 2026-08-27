import { UserService } from "../services/users.service.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";

const userService = new UserService();

// Tipos de documento permitidos para la entidad usuario
const ALLOWED_DOC_TYPES = ["DNI", "LICENSE", "PASSPORT", "TAX_ID", "PROOF_OF_ADDRESS"];

export class UserController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await userService.getAllUsers({ page, limit });

      res.json({ 
        status: "success", 
        page,
        limit,
        payload: users 
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.uid);
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.uid, req.body);
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const user = await userService.deleteUser(req.params.uid);
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async uploadDocuments(req, res, next) {
    try {
      const { uid } = req.params;
      const { docType } = req.body;

      if (!req.file) {
        throw CustomError.createError({
          name: "MissingFileError",
          cause: "No se ha adjuntado ningún archivo.",
          message: "El archivo es requerido para esta operación.",
          code: EErrors.INVALID_TYPES,
          statusCode: 400
        });
      }

      if (!docType) {
        throw CustomError.createError({
          name: "MissingDocTypeError",
          cause: "Campo docType no especificado.",
          message: "Debe especificar el tipo de documento (ej. DNI, LICENSE, PASSPORT, TAX_ID, PROOF_OF_ADDRESS).",
          code: EErrors.INVALID_TYPES,
          statusCode: 400
        });
      }

      if (!ALLOWED_DOC_TYPES.includes(docType)) {
        throw CustomError.createError({
          name: "InvalidDocTypeError",
          cause: `El tipo de documento '${docType}' no es válido.`,
          message: `Tipo de documento no permitido. Tipos válidos: ${ALLOWED_DOC_TYPES.join(", ")}`,
          code: EErrors.INVALID_TYPES,
          statusCode: 400
        });
      }

      let user = null;
      try {
        user = await userService.getUserById(uid);
      } catch (err) {
        user = null;
      }

      if (!user) {
        throw CustomError.createError({
          name: "NotFoundError",
          cause: `No se encontró usuario con el ID ${uid}`,
          message: "Usuario no encontrado.",
          code: EErrors.RESOURCE_NOT_FOUND,
          statusCode: 404
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

      if (!user.documents) {
        user.documents = [];
      }

      user.documents.push(documentMeta);
      await userService.updateUser(uid, { documents: user.documents });

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