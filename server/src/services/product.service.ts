import { productRepo } from '../repositories/product.repo.js';
import { orderRepo } from '../repositories/order.repo.js';

export class ProductService {
  async getProducts(category?: string, lowStock?: boolean, page = 1, limit = 50) {
    const filter: Record<string, any> = {};
    if (category && category !== 'ALL') filter.category = category;

    if (lowStock) {
      return productRepo.findLowStock();
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      productRepo.findAll(filter, limit, skip),
      productRepo.count(filter),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getInventoryRisk(storeId?: string) {
    // Find all products whose stock is at or below reorder level
    const lowStockProducts = await productRepo.findLowStock();

    // Estimate daily run-rate & days of inventory remaining
    const enriched = lowStockProducts.map((p) => {
      const dailyVelocity = p.isPopular ? Math.max(12, Math.round(p.stock * 0.4)) : Math.max(4, Math.round(p.stock * 0.2));
      const daysOfCover = Number((p.stock / dailyVelocity).toFixed(1));
      const riskLevel = daysOfCover <= 0.5 ? 'CRITICAL' : daysOfCover <= 1.5 ? 'HIGH' : 'MEDIUM';

      return {
        sku: p.sku,
        name: p.name,
        category: p.category,
        aisle: p.aisle,
        rack: p.rack,
        currentStock: p.stock,
        reorderLevel: p.reorderLevel,
        unitPrice: p.unitPrice,
        dailyVelocity,
        daysOfCover,
        riskLevel,
        suggestedReorderQty: Math.max(40, p.reorderLevel * 3 - p.stock),
        substitutionSku: p.substitutionSku || 'N/A',
      };
    });

    return {
      totalLowStockItems: enriched.length,
      criticalStockoutRiskCount: enriched.filter((i) => i.riskLevel === 'CRITICAL').length,
      items: enriched,
    };
  }
}

export const productService = new ProductService();
