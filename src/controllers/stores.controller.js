import { StoreService } from "../services/stores.service.js";

const storeService = new StoreService();

export class StoreController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const stores = await storeService.getAllStores({ page, limit });
      res.json({ status: "success", page, limit, payload: stores });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const store = await storeService.getStoreById(req.params.sid);
      res.json({ status: "success", payload: store });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const store = await storeService.createStore(req.body);
      res.status(201).json({ status: "success", payload: store });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const store = await storeService.updateStore(req.params.sid, req.body);
      res.json({ status: "success", payload: store });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const store = await storeService.deleteStore(req.params.sid);
      res.json({ status: "success", payload: store });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}