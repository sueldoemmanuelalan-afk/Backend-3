import { UserService } from "../services/users.service.js";

const userService = new UserService();

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({ status: "success", payload: users });
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
}