import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'MANAGER', 'ANALYST']), (req, res, next) =>
  orderController.getOrders(req, res, next)
);

router.get('/:orderId', authorize(['ADMIN', 'MANAGER', 'ANALYST']), (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

export default router;
