import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => alertController.getActive(req, res, next));
router.get('/recent', (req, res, next) => alertController.getRecent(req, res, next));
router.post('/', authorize(['ADMIN', 'MANAGER']), (req, res, next) => alertController.create(req, res, next));
router.patch('/:alertId/resolve', authorize(['ADMIN', 'MANAGER']), (req, res, next) =>
  alertController.resolve(req, res, next)
);

export default router;
