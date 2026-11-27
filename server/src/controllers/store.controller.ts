import { Request, Response, NextFunction } from 'express';
import { storeService } from '../services/store.service.js';

export class StoreController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stores = await storeService.getAllStores();
      res.status(200).json({ success: true, data: stores });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.params;
      const store = await storeService.getStoreById(storeId);
      res.status(200).json({ success: true, data: store });
    } catch (err) {
      next(err);
    }
  }
}

export const storeController = new StoreController();
