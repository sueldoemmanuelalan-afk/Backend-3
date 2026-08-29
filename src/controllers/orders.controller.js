import { OrderService } from "../services/orders.service.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";
import orderModel from "../models/order.model.js";

const orderService = new OrderService();

export class OrderController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const orders = await orderService.getAllOrders({ page, limit });
      
      res.json({ 
        status: "success", 
        page,
        limit,
        payload: orders 
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.oid);
      res.json({ status: "success", payload: order });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({ status: "success", payload: order });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const order = await orderService.updateOrderStatus(req.params.oid, req.body.status);
      res.json({ status: "success", payload: order });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const order = await orderService.deleteOrder(req.params.oid);
      res.json({ status: "success", payload: order });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static uploadProof = async (req, res, next) => {
    try {
      const { oid } = req.params;

      if (!req.file) {
        throw CustomError.createError({
          name: "MissingFileError",
          cause: "No se ha adjuntado ningún comprobante.",
          message: "El archivo de comprobante es requerido.",
          code: EErrors.INVALID_TYPES,
          statusCode: 400
        });
      }

      let order = null;
      try {
        order = await orderModel.findById(oid);
      } catch (err) {
        order = null;
      }

      if (!order) {
        throw CustomError.createError({
          name: "NotFoundError",
          cause: `No se encontró la orden con ID ${oid}`,
          message: "Orden no encontrada.",
          code: EErrors.RESOURCE_NOT_FOUND,
          statusCode: 404
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

      order.proof = proofMeta;
      await order.save();

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