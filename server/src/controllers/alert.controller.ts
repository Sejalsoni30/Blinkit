import { Request, Response, NextFunction } from 'express';
import { alertService } from '../services/alert.service.js';

export class AlertController {
  async getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.query as Record<string, string>;
      const alerts = await alertService.getActiveAlerts(storeId);
      res.status(200).json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  }

  async getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, limit = '20' } = req.query as Record<string, string>;
      const alerts = await alertService.getRecentAlerts(storeId, parseInt(limit, 10));
      res.status(200).json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alert = await alertService.createAlert(req.body);
      res.status(201).json({ success: true, data: alert });
    } catch (err) {
      next(err);
    }
  }

  async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { alertId } = req.params;
      const resolvedBy = req.user?.name || 'Store Ops';
      const alert = await alertService.resolveAlert(alertId, resolvedBy);
      res.status(200).json({ success: true, data: alert });
    } catch (err) {
      next(err);
    }
  }
}

export const alertController = new AlertController();
