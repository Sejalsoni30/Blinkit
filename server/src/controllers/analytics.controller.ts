import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getOverview(storeId, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getStageFunnel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getStageFunnel(storeId, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getRootCauses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getRootCauses(storeId, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getHourlyDemand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getHourlyDemand(storeId, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getAisleHeatmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getAisleHeatmap(storeId, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getSlowestSkus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, limit } = req.query as Record<string, string>;
      const data = await analyticsService.getSlowestSkus(storeId, limit ? parseInt(limit, 10) : 10);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getStoreComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query as Record<string, string>;
      const data = await analyticsService.getStoreComparison(startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
