import { MocksService } from '../services/mocks.service.js';

export class MocksController {
  static getUsers(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const users = MocksService.getUsers(qty);
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      next(error);
    }
  }

  static async seedData(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const result = await MocksService.seedData(qty, qty);
      res.status(201).json({
        status: 'success',
        message: 'Base de datos poblada con éxito',
        payload: result
      });
    } catch (error) {
      next(error);
    }
  }
}