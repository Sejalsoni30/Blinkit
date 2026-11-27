import { Product, IProduct } from '../models/Product.js';

export class ProductRepository {
  async findAll(filter: Record<string, any> = {}, limit = 50, skip = 0): Promise<IProduct[]> {
    return Product.find(filter).skip(skip).limit(limit).sort({ isPopular: -1, name: 1 }).lean<IProduct[]>();
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku }).lean<IProduct | null>();
  }

  async findLowStock(threshold?: number): Promise<IProduct[]> {
    const query = threshold !== undefined 
      ? { stock: { $lte: threshold } }
      : { $expr: { $lte: ['$stock', '$reorderLevel'] } };
    return Product.find(query).sort({ stock: 1 }).lean<IProduct[]>();
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return Product.countDocuments(filter);
  }
}

export const productRepo = new ProductRepository();
