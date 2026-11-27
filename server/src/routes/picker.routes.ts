import { Router } from 'express';
import { pickerController } from '../controllers/picker.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => pickerController.getAll(req, res, next));
router.get('/leaderboard', (req, res, next) => pickerController.getLeaderboard(req, res, next));

export default router;
