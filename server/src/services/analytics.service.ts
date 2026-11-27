import { orderRepo } from '../repositories/order.repo.js';
import { darkStoreRepo } from '../repositories/darkStore.repo.js';
import { cache } from '../utils/cache.js';

export class AnalyticsService {
  private buildMatchFilter(storeId?: string, startDate?: string, endDate?: string) {
    const filter: Record<string, any> = {};

    if (storeId && storeId !== 'ALL') {
      filter.storeId = storeId;
    }

    if (startDate || endDate) {
      filter.placedAt = {};
      if (startDate) filter.placedAt.$gte = new Date(startDate);
      if (endDate) filter.placedAt.$lte = new Date(endDate);
    }

    return filter;
  }

  async getOverview(storeId?: string, startDate?: string, endDate?: string) {
    const cacheKey = `overview_${storeId || 'ALL'}_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId, startDate, endDate);
    const currentMetrics = await orderRepo.getOverviewMetrics(matchFilter);

    // Compute previous period comparison for trend deltas
    let trend = {
      slaChange: 0,
      orderChange: 0,
      breachChange: 0,
      deliveryTimeChangeSec: 0,
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationMs = end.getTime() - start.getTime();
      const prevStart = new Date(start.getTime() - durationMs);
      const prevEnd = start;

      const prevFilter = {
        ...matchFilter,
        placedAt: { $gte: prevStart, $lt: prevEnd },
      };

      const prevMetrics = await orderRepo.getOverviewMetrics(prevFilter);
      if (prevMetrics.totalOrders > 0) {
        trend = {
          slaChange: Number((currentMetrics.slaComplianceRate - prevMetrics.slaComplianceRate).toFixed(1)),
          orderChange: Number((((currentMetrics.totalOrders - prevMetrics.totalOrders) / prevMetrics.totalOrders) * 100).toFixed(1)),
          breachChange: Number((((currentMetrics.breachedOrders - prevMetrics.breachedOrders) / (prevMetrics.breachedOrders || 1)) * 100).toFixed(1)),
          deliveryTimeChangeSec: Math.round(currentMetrics.avgTotalSeconds - prevMetrics.avgTotalSeconds),
        };
      }
    }

    const result = {
      metrics: currentMetrics,
      trend,
    };

    cache.set(cacheKey, result, 60);
    return result;
  }

  async getStageFunnel(storeId?: string, startDate?: string, endDate?: string) {
    const cacheKey = `funnel_${storeId || 'ALL'}_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId, startDate, endDate);
    const stats = await orderRepo.getStageFunnelStats(matchFilter);

    // Benchmark targets for 10-minute SLA (in seconds)
    const benchmarks = {
      assign: 25,
      pick: 180,
      pack: 50,
      handover: 45,
      ride: 240,
      total: 600,
    };

    const stages = [
      {
        id: 'assign',
        name: 'Order Assignment',
        description: 'Placed to Picker Assigned',
        avgSeconds: stats?.avg.assign || 0,
        p90Seconds: stats?.p90.assign || 0,
        targetSeconds: benchmarks.assign,
        isBottleneck: (stats?.avg.assign || 0) > benchmarks.assign,
      },
      {
        id: 'pick',
        name: 'Item Picking',
        description: 'Picker picking items across aisles',
        avgSeconds: stats?.avg.pick || 0,
        p90Seconds: stats?.p90.pick || 0,
        targetSeconds: benchmarks.pick,
        isBottleneck: (stats?.avg.pick || 0) > benchmarks.pick,
      },
      {
        id: 'pack',
        name: 'Bagging & QC Pack',
        description: 'Verification, bagging & sealing',
        avgSeconds: stats?.avg.pack || 0,
        p90Seconds: stats?.p90.pack || 0,
        targetSeconds: benchmarks.pack,
        isBottleneck: (stats?.avg.pack || 0) > benchmarks.pack,
      },
      {
        id: 'handover',
        name: 'Rider Handover',
        description: 'Bag handoff to delivery rider',
        avgSeconds: stats?.avg.handover || 0,
        p90Seconds: stats?.p90.handover || 0,
        targetSeconds: benchmarks.handover,
        isBottleneck: (stats?.avg.handover || 0) > benchmarks.handover,
      },
      {
        id: 'ride',
        name: 'Rider Transit (Last Mile)',
        description: 'Rider transit to customer doorstep',
        avgSeconds: stats?.avg.ride || 0,
        p90Seconds: stats?.p90.ride || 0,
        targetSeconds: benchmarks.ride,
        isBottleneck: (stats?.avg.ride || 0) > benchmarks.ride,
      },
    ];

    const result = {
      totalOrdersEvaluated: stats?.count || 0,
      avgTotalSeconds: stats?.avg.total || 0,
      p90TotalSeconds: stats?.p90.total || 0,
      slaTargetSeconds: benchmarks.total,
      stages,
    };

    cache.set(cacheKey, result, 60);
    return result;
  }

  async getRootCauses(storeId?: string, startDate?: string, endDate?: string) {
    const cacheKey = `causes_${storeId || 'ALL'}_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId, startDate, endDate);
    const causes = await orderRepo.getRootCauses(matchFilter);

    const totalBreaches = causes.reduce((acc, c) => acc + c.count, 0);

    const causeLabels: Record<string, { label: string; action: string }> = {
      SLOW_PICK: {
        label: 'Picking Inefficiency & Aisle Congestion',
        action: 'Relocate top-picked SKUs closer to packing station; retrain junior pickers.',
      },
      PACKING_QUEUE: {
        label: 'QC & Bagging Station Congestion',
        action: 'Add second packing bench or pre-print order bags during surge windows.',
      },
      RIDER_WAIT: {
        label: 'Rider Handover Queue Delay',
        action: 'Improve staging bay assignment; pre-dispatch rider when order enters packing.',
      },
      STOCKOUT_SUBSTITUTION: {
        label: 'Stockout / Substitution Latency',
        action: 'Auto-approve top 3 substitution candidates; sync reorder triggers.',
      },
      TRAFFIC_RAIN: {
        label: 'Extreme Weather / Last-Mile Transit',
        action: 'Dynamic geofence restriction (reduce radius to 1.5km during heavy downpour).',
      },
      NONE: {
        label: 'Unclassified Delay',
        action: 'Review order event audit logs.',
      },
    };

    const formattedCauses = causes.map((c) => ({
      cause: c.cause,
      label: causeLabels[c.cause]?.label || c.cause,
      count: c.count,
      percentage: totalBreaches > 0 ? Number(((c.count / totalBreaches) * 100).toFixed(1)) : 0,
      avgDuration: c.avgDuration,
      recommendedAction: causeLabels[c.cause]?.action || 'Investigate bottleneck stage.',
      sampleOrders: c.sampleOrders,
    }));

    const result = {
      totalBreaches,
      causes: formattedCauses,
    };

    cache.set(cacheKey, result, 60);
    return result;
  }

  async getHourlyDemand(storeId?: string, startDate?: string, endDate?: string) {
    const cacheKey = `hourly_${storeId || 'ALL'}_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId, startDate, endDate);
    const hourly = await orderRepo.getHourlyDemand(matchFilter);

    cache.set(cacheKey, hourly, 60);
    return hourly;
  }

  async getAisleHeatmap(storeId?: string, startDate?: string, endDate?: string) {
    const cacheKey = `aisle_${storeId || 'ALL'}_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId, startDate, endDate);
    const heatmap = await orderRepo.getAisleHeatmap(matchFilter);

    cache.set(cacheKey, heatmap, 60);
    return heatmap;
  }

  async getSlowestSkus(storeId?: string, limit = 10) {
    const cacheKey = `skus_${storeId || 'ALL'}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(storeId);
    const skus = await orderRepo.getSlowestSkus(matchFilter, limit);

    cache.set(cacheKey, skus, 60);
    return skus;
  }

  async getStoreComparison(startDate?: string, endDate?: string) {
    const cacheKey = `comparison_${startDate || ''}_${endDate || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const matchFilter = this.buildMatchFilter(undefined, startDate, endDate);
    const comparison = await orderRepo.getStoreComparison(matchFilter);
    const allStores = await darkStoreRepo.findAll();

    const storeMap = new Map(allStores.map((s) => [s.storeId, s]));

    const enriched = comparison.map((item) => {
      const store = storeMap.get(item.storeId);
      return {
        ...item,
        storeName: store ? store.name : item.storeId,
        city: store ? store.city : 'Unknown',
        capacity: store ? store.capacity : 200,
        pickerCount: store ? store.pickerCount : 12,
      };
    });

    cache.set(cacheKey, enriched, 60);
    return enriched;
  }
}

export const analyticsService = new AnalyticsService();
