import { Router } from 'express';
import { MocksController } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/users', MocksController.getUsers);
router.get('/orders', MocksController.getOrders);
router.get('/deliveries', MocksController.getDeliveries);
router.post('/seed', MocksController.seedData);

export default router;