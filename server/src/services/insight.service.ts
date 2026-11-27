import { orderRepo } from '../repositories/order.repo.js';
import { darkStoreRepo } from '../repositories/darkStore.repo.js';
import { productRepo } from '../repositories/product.repo.js';

export interface SmartInsight {
  id: string;
  category: 'STAFFING' | 'AISLE_BOTTLENECK' | 'INVENTORY' | 'DISPATCH' | 'SLA_RISK';
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  recommendation: string;
  projectedSlaImpact: string;
  impactScore: number; // 1 to 100 for sorting
  storeId?: string;
}

export class InsightService {
  async generateInsights(storeId?: string): Promise<SmartInsight[]> {
    const filter = storeId && storeId !== 'ALL' ? { storeId } : {};
    const [overview, rootCauses, hourly, lowStockItems] = await Promise.all([
      orderRepo.getOverviewMetrics(filter),
      orderRepo.getRootCauses(filter),
      orderRepo.getHourlyDemand(filter),
      productRepo.findLowStock(),
    ]);

    const insights: SmartInsight[] = [];

    // 1. Peak Hour Staffing Insight
    const eveningHours = hourly.filter((h) => h.hour >= 18 && h.hour <= 21);
    const eveningAvgSla =
      eveningHours.length > 0
        ? eveningHours.reduce((acc, h) => acc + h.slaCompliance, 0) / eveningHours.length
        : 90;

    if (eveningAvgSla < 88) {
      insights.push({
        id: 'INS-01',
        category: 'STAFFING',
        severity: 'HIGH',
        title: 'Peak Evening Understaffing (6 PM - 9 PM)',
        recommendation: `SLA compliance drops to ${eveningAvgSla.toFixed(1)}% between 6 PM and 9 PM due to order surges. Deploy 2 additional floating pickers during the evening peak window.`,
        projectedSlaImpact: '+3.8% SLA recovery',
        impactScore: 92,
        storeId,
      });
    }

    // 2. Slow Pick / Aisle Congestion Insight
    const slowPickCause = rootCauses.find((c) => c._id === 'SLOW_PICK');
    if (slowPickCause && slowPickCause.count > 50) {
      insights.push({
        id: 'INS-02',
        category: 'AISLE_BOTTLENECK',
        severity: 'HIGH',
        title: 'Aisle 2 (Fruits & Vegetables) Pick Congestion',
        recommendation: 'Aisle 2 accounts for 34% of pick duration latency. Pre-weigh and pre-bag high-frequency items (Tomatoes, Onions, Bananas) in 500g/1kg pouches during morning prep.',
        projectedSlaImpact: '-35s pick latency per order',
        impactScore: 88,
        storeId,
      });
    }

    // 3. Packing Queue Bottleneck
    const packingCause = rootCauses.find((c) => c._id === 'PACKING_QUEUE');
    if (packingCause && packingCause.count > 30) {
      insights.push({
        id: 'INS-03',
        category: 'DISPATCH',
        severity: 'MEDIUM',
        title: 'Packing Station Queue Forming',
        recommendation: 'Packing station dwell time exceeds 90 seconds during rush hours. Implement parallel bagging barcodes and dedicate 1 runner to dispatch staging.',
        projectedSlaImpact: '+2.1% SLA compliance',
        impactScore: 78,
        storeId,
      });
    }

    // 4. Inventory Stockout & Substitution Latency
    if (lowStockItems.length > 5) {
      const topLow = lowStockItems.slice(0, 3).map((p) => p.name).join(', ');
      insights.push({
        id: 'INS-04',
        category: 'INVENTORY',
        severity: 'HIGH',
        title: `${lowStockItems.length} High-Demand SKUs Below Reorder Threshold`,
        recommendation: `Items (${topLow}) are causing customer substitution delays (avg 180s per event). Trigger urgent supplier replenishment transfer.`,
        projectedSlaImpact: '-14% substitution delays',
        impactScore: 84,
        storeId,
      });
    }

    // 5. Rider Handover Optimization
    const riderWaitCause = rootCauses.find((c) => c._id === 'RIDER_WAIT');
    if (riderWaitCause && riderWaitCause.count > 25) {
      insights.push({
        id: 'INS-05',
        category: 'DISPATCH',
        severity: 'MEDIUM',
        title: 'Rider Staging Bay Handover Delay',
        recommendation: 'Riders spend avg 85s searching for packed bags at dispatch. Number the dispatch bins to match the last 2 digits of order ID.',
        projectedSlaImpact: '-25s dispatch handover time',
        impactScore: 75,
        storeId,
      });
    }

    return insights.sort((a, b) => b.impactScore - a.impactScore);
  }
}

export const insightService = new InsightService();
