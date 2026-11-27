import { Router } from 'express';
import { importController } from '../controllers/import.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

// Only ADMIN (City Ops Head) and STORE MANAGER can import orders
router.post('/orders', authorize(['ADMIN', 'MANAGER']), (req, res, next) =>
  importController.importOrders(req, res, next)
);

router.get('/template', (req, res, next) => importController.getTemplate(req, res, next));

export default router;
