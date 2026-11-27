import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// All analytics endpoints require authentication
router.use(authenticate);

router.get('/overview', (req, res, next) => analyticsController.getOverview(req, res, next));
router.get('/stage-breakdown', (req, res, next) => analyticsController.getStageFunnel(req, res, next));
router.get('/root-causes', (req, res, next) => analyticsController.getRootCauses(req, res, next));
router.get('/hourly-demand', (req, res, next) => analyticsController.getHourlyDemand(req, res, next));
router.get('/aisle-heatmap', (req, res, next) => analyticsController.getAisleHeatmap(req, res, next));
router.get('/sku-pick-times', (req, res, next) => analyticsController.getSlowestSkus(req, res, next));

// Store comparison leaderboard is for ADMIN (City Ops Head) and ANALYST
router.get('/store-comparison', authorize(['ADMIN', 'ANALYST']), (req, res, next) =>
  analyticsController.getStoreComparison(req, res, next)
);

export default router;
