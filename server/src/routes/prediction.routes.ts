import { Router } from 'express';
import { predictionController } from '../controllers/prediction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/delay', (req, res, next) => predictionController.predictDelay(req, res, next));
router.post('/what-if', (req, res, next) => predictionController.whatIf(req, res, next));
router.get('/insights', (req, res, next) => predictionController.getInsights(req, res, next));

export default router;
