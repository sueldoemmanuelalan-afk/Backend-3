import { OrderService } from "../services/orders.service.js";

const orderService = new OrderService();

export class OrderController {
  static async getAll(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.json({ status: "success", payload: orders });
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
}