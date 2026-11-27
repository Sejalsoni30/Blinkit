import { Router } from 'express';
import { storeController } from '../controllers/store.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => storeController.getAll(req, res, next));
router.get('/:storeId', (req, res, next) => storeController.getById(req, res, next));

export default router;
