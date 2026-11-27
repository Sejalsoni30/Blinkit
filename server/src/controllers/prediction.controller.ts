import { Request, Response, NextFunction } from 'express';
import { predictionService } from '../services/prediction.service.js';
import { insightService } from '../services/insight.service.js';

export class PredictionController {
  async predictDelay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        itemCount,
        hour,
        storeLoadIndex,
        aisleSpreadCount,
        pickerExperience,
        weatherCondition,
        storeId,
      } = req.body;

      const prediction = await predictionService.predictDelay({
        itemCount: Number(itemCount) || 3,
        hour: Number(hour) ?? new Date().getHours(),
        storeLoadIndex: storeLoadIndex ? Number(storeLoadIndex) : 1.0,
        aisleSpreadCount: Number(aisleSpreadCount) || 2,
        pickerExperience,
        weatherCondition,
        storeId,
      });

      res.status(200).json({ success: true, data: prediction });
    } catch (err) {
      next(err);
    }
  }

  async whatIf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        storeId,
        pickerCountChange = 0,
        avgPickSpeedImprovementPercent = 0,
        riderHandoverReductionSeconds = 0,
        orderVolumeSurgePercent = 0,
      } = req.body;

      const simulation = await predictionService.runWhatIf({
        storeId,
        pickerCountChange: Number(pickerCountChange),
        avgPickSpeedImprovementPercent: Number(avgPickSpeedImprovementPercent),
        riderHandoverReductionSeconds: Number(riderHandoverReductionSeconds),
        orderVolumeSurgePercent: Number(orderVolumeSurgePercent),
      });

      res.status(200).json({ success: true, data: simulation });
    } catch (err) {
      next(err);
    }
  }

  async getInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.query as Record<string, string>;
      const insights = await insightService.generateInsights(storeId);
      res.status(200).json({ success: true, data: insights });
    } catch (err) {
      next(err);
    }
  }
}

export const predictionController = new PredictionController();
