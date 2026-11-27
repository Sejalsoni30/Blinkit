import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { DelayReason } from '../models/Order.js';

export class OrderController {
  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        storeId,
        status,
        delayReason,
        delayedOnly,
        startDate,
        endDate,
        search,
        page = '1',
        limit = '20',
        sortBy = 'placedAt',
        sortOrder = 'desc',
      } = req.query as Record<string, string>;

      const filter = {
        storeId,
        status,
        delayReason: delayReason as DelayReason,
        delayedOnly: delayedOnly === 'true',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        search,
      };

      const pagination = {
        page: parseInt(page, 10),
        limit: Math.min(parseInt(limit, 10), 100),
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await orderService.getOrders(filter, pagination);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
