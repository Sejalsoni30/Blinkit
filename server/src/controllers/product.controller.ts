import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, lowStock, page = '1', limit = '50' } = req.query as Record<string, string>;
      const data = await productService.getProducts(
        category,
        lowStock === 'true',
        parseInt(page, 10),
        parseInt(limit, 10)
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getInventoryRisk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = req.query as Record<string, string>;
      const data = await productService.getInventoryRisk(storeId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
