import { Router } from 'express';
import { ProductController } from '../controllers/products.controller.js';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);

export default router;