import { Router } from 'express';
import { MocksController } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/users', MocksController.getUsers);
router.post('/seed', MocksController.seedData);
router.get('/generateData', MocksController.seedData); 

export default router;