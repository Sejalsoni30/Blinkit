import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => productController.getProducts(req, res, next));
router.get('/inventory-risk', (req, res, next) => productController.getInventoryRisk(req, res, next));

export default router;
