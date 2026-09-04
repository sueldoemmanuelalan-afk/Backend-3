import { OrderService } from "../services/orders.service.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";

const orderService = new OrderService();

export class OrderController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await orderService.getAllOrders({ page, limit });

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
      const order = await orderService.getOrderById(req.params.oid);
      res.status(200).json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateOrderStatus(req.params.oid, req.body.status);
      res.status(200).json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const order = await orderService.deleteOrder(req.params.oid);
      res.status(200).json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  static uploadProof = async (req, res, next) => {
    try {
      const { oid } = req.params;

      if (!req.file) {
        CustomError.createError({
          name: "MissingFileError",
          cause: "No se ha adjuntado ningún comprobante.",
          message: "El archivo de comprobante es requerido.",
          code: EErrors.INVALID_TYPES_ERROR,
          statusCode: 400
        });
      }

      const proofMeta = {
        name: req.file.originalname,
        filename: req.file.filename,
        reference: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      };

      await orderService.attachProof(oid, proofMeta);

      logger.info(`Comprobante de entrega asociado exitosamente a la orden ${oid}`);

      res.status(200).json({
        status: "success",
        message: "Comprobante subido y asociado correctamente",
        payload: proofMeta
      });
    } catch (error) {
      next(error);
    }
  };
}