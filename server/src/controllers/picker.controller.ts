import { Request, Response, NextFunction } from 'express';
import { pickerService } from '../services/picker.service.js';

export class PickerController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.query as Record<string, string>;
      const pickers = await pickerService.getAllPickers(storeId);
      res.status(200).json({ success: true, data: pickers });
    } catch (err) {
      next(err);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.query as Record<string, string>;
      const leaderboard = await pickerService.getPickerLeaderboard(storeId);
      res.status(200).json({ success: true, data: leaderboard });
    } catch (err) {
      next(err);
    }
  }
}

export const pickerController = new PickerController();
