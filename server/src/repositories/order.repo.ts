import { Order, IOrder, DelayReason } from '../models/Order.js';
import { PipelineStage } from 'mongoose';

export interface OrderFilterParams {
  storeId?: string;
  status?: string;
  delayReason?: DelayReason;
  delayedOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class OrderRepository {
  async findById(orderId: string): Promise<IOrder | null> {
    return Order.findOne({ orderId }).lean<IOrder | null>();
  }

  async findOrders(
    filter: OrderFilterParams,
    pagination: PaginationParams
  ): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
    const query: Record<string, any> = {};

    if (filter.storeId && filter.storeId !== 'ALL') {
      query.storeId = filter.storeId;
    }
    if (filter.status && filter.status !== 'ALL') {
      query.status = filter.status;
    }
    if (filter.delayReason && filter.delayReason !== 'NONE') {
      query.delayReason = filter.delayReason;
    }
    if (filter.delayedOnly) {
      query.isBreached = true;
    }
    if (filter.startDate || filter.endDate) {
      query.placedAt = {};
      if (filter.startDate) query.placedAt.$gte = filter.startDate;
      if (filter.endDate) query.placedAt.$lte = filter.endDate;
    }
    if (filter.search) {
      query.$or = [
        { orderId: { $regex: filter.search, $options: 'i' } },
        { pickerId: { $regex: filter.search, $options: 'i' } },
        { riderId: { $regex: filter.search, $options: 'i' } },
        { 'items.name': { $regex: filter.search, $options: 'i' } },
      ];
    }

    const sortField = pagination.sortBy || 'placedAt';
    const sortDirection = pagination.sortOrder === 'asc' ? 1 : -1;
    const skip = (pagination.page - 1) * pagination.limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(pagination.limit)
        .lean<IOrder[]>(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    return (await Order.create(orderData)).toObject();
  }

  async insertMany(orders: Partial<IOrder>[]): Promise<any> {
    return Order.insertMany(orders, { ordered: false });
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return Order.countDocuments(filter);
  }

  async getStageFunnelStats(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgAssign: { $avg: '$stageDurations.assign' },
          avgPick: { $avg: '$stageDurations.pick' },
          avgPack: { $avg: '$stageDurations.pack' },
          avgHandover: { $avg: '$stageDurations.handover' },
          avgRide: { $avg: '$stageDurations.ride' },
          avgTotal: { $avg: '$totalDurationSeconds' },
          assignTimes: { $push: '$stageDurations.assign' },
          pickTimes: { $push: '$stageDurations.pick' },
          packTimes: { $push: '$stageDurations.pack' },
          handoverTimes: { $push: '$stageDurations.handover' },
          rideTimes: { $push: '$stageDurations.ride' },
          totalTimes: { $push: '$totalDurationSeconds' },
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    if (!result || result.length === 0) {
      return null;
    }

    const doc = result[0];
    const calcP90 = (arr: number[]) => {
      if (!arr || arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.9);
      return Math.round(sorted[index] || 0);
    };

    return {
      count: doc.count,
      avg: {
        assign: Math.round(doc.avgAssign || 0),
        pick: Math.round(doc.avgPick || 0),
        pack: Math.round(doc.avgPack || 0),
        handover: Math.round(doc.avgHandover || 0),
        ride: Math.round(doc.avgRide || 0),
        total: Math.round(doc.avgTotal || 0),
      },
      p90: {
        assign: calcP90(doc.assignTimes),
        pick: calcP90(doc.pickTimes),
        pack: calcP90(doc.packTimes),
        handover: calcP90(doc.handoverTimes),
        ride: calcP90(doc.rideTimes),
        total: calcP90(doc.totalTimes),
      },
    };
  }

  async getOverviewMetrics(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          breachedOrders: {
            $sum: { $cond: [{ $eq: ['$isBreached', true] }, 1, 0] },
          },
          avgTotalSeconds: { $avg: '$totalDurationSeconds' },
          avgPickSeconds: { $avg: '$stageDurations.pick' },
          totalSubstitutions: {
            $sum: { $size: { $ifNull: ['$substitutions', []] } },
          },
          totalAmount: { $sum: '$totalAmount' },
          avgItemCount: { $avg: '$itemCount' },
        },
      },
    ];

    const res = await Order.aggregate(pipeline);
    if (!res || res.length === 0) {
      return {
        totalOrders: 0,
        slaComplianceRate: 100,
        breachedOrders: 0,
        avgTotalSeconds: 0,
        avgPickSeconds: 0,
        substitutionRate: 0,
        totalAmount: 0,
        avgItemCount: 0,
      };
    }

    const d = res[0];
    const slaComplianceRate = d.totalOrders > 0
      ? Number((((d.totalOrders - d.breachedOrders) / d.totalOrders) * 100).toFixed(1))
      : 100;
    const substitutionRate = d.totalOrders > 0
      ? Number(((d.totalSubstitutions / d.totalOrders) * 100).toFixed(1))
      : 0;

    return {
      totalOrders: d.totalOrders,
      slaComplianceRate,
      breachedOrders: d.breachedOrders,
      avgTotalSeconds: Math.round(d.avgTotalSeconds || 0),
      avgPickSeconds: Math.round(d.avgPickSeconds || 0),
      substitutionRate,
      totalAmount: Math.round(d.totalAmount || 0),
      avgItemCount: Number((d.avgItemCount || 0).toFixed(1)),
    };
  }

  async getRootCauses(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...matchFilter,
          isBreached: true,
        },
      },
      {
        $group: {
          _id: '$delayReason',
          count: { $sum: 1 },
          avgDuration: { $avg: '$totalDurationSeconds' },
          sampleOrders: {
            $push: {
              orderId: '$orderId',
              storeId: '$storeId',
              itemCount: '$itemCount',
              totalDuration: '$totalDurationSeconds',
              placedAt: '$placedAt',
            },
          },
        },
      },
      {
        $project: {
          cause: '$_id',
          count: 1,
          avgDuration: { $round: ['$avgDuration', 0] },
          sampleOrders: { $slice: ['$sampleOrders', 5] },
        },
      },
      { $sort: { count: -1 } },
    ];

    return Order.aggregate(pipeline);
  }

  async getHourlyDemand(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      {
        $project: {
          hour: { $hour: { date: '$placedAt', timezone: 'Asia/Kolkata' } },
          isBreached: 1,
          pickDuration: '$stageDurations.pick',
          totalDuration: '$totalDurationSeconds',
        },
      },
      {
        $group: {
          _id: '$hour',
          orderCount: { $sum: 1 },
          breachCount: {
            $sum: { $cond: [{ $eq: ['$isBreached', true] }, 1, 0] },
          },
          avgPickSeconds: { $avg: '$pickDuration' },
          avgTotalSeconds: { $avg: '$totalDuration' },
        },
      },
      {
        $project: {
          hour: '$_id',
          orderCount: 1,
          breachCount: 1,
          avgPickSeconds: { $round: ['$avgPickSeconds', 0] },
          avgTotalSeconds: { $round: ['$avgTotalSeconds', 0] },
          slaCompliance: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ['$orderCount', '$breachCount'] }, '$orderCount'] },
                  100,
                ],
              },
              1,
            ],
          },
        },
      },
      { $sort: { hour: 1 } },
    ];

    return Order.aggregate(pipeline);
  }

  async getAisleHeatmap(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      { $unwind: '$items' },
      {
        $project: {
          aisle: '$items.aisle',
          hour: { $hour: { date: '$placedAt', timezone: 'Asia/Kolkata' } },
          pickDuration: '$stageDurations.pick',
          isBreached: 1,
        },
      },
      {
        $group: {
          _id: { aisle: '$aisle', hour: '$hour' },
          picksCount: { $sum: 1 },
          avgPickSeconds: { $avg: '$pickDuration' },
        },
      },
      {
        $project: {
          aisle: '$_id.aisle',
          hour: '$_id.hour',
          picksCount: 1,
          avgPickSeconds: { $round: ['$avgPickSeconds', 0] },
        },
      },
      { $sort: { aisle: 1, hour: 1 } },
    ];

    return Order.aggregate(pipeline);
  }

  async getSlowestSkus(matchFilter: Record<string, any>, limit = 10) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          name: { $first: '$items.name' },
          aisle: { $first: '$items.aisle' },
          orderCount: { $sum: 1 },
          totalUnits: { $sum: '$items.qty' },
          avgOrderPickSeconds: { $avg: '$stageDurations.pick' },
          breachOrdersWithItem: {
            $sum: { $cond: [{ $eq: ['$isBreached', true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          sku: '$_id',
          name: 1,
          aisle: 1,
          orderCount: 1,
          totalUnits: 1,
          avgOrderPickSeconds: { $round: ['$avgOrderPickSeconds', 0] },
          breachRate: {
            $round: [
              { $multiply: [{ $divide: ['$breachOrdersWithItem', '$orderCount'] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { avgOrderPickSeconds: -1 } },
      { $limit: limit },
    ];

    return Order.aggregate(pipeline);
  }

  async getStoreComparison(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      {
        $group: {
          _id: '$storeId',
          totalOrders: { $sum: 1 },
          breachedOrders: {
            $sum: { $cond: [{ $eq: ['$isBreached', true] }, 1, 0] },
          },
          avgDeliverySeconds: { $avg: '$totalDurationSeconds' },
          avgPickSeconds: { $avg: '$stageDurations.pick' },
          avgPackSeconds: { $avg: '$stageDurations.pack' },
          avgHandoverSeconds: { $avg: '$stageDurations.handover' },
          avgRideSeconds: { $avg: '$stageDurations.ride' },
          substitutionsCount: {
            $sum: { $size: { $ifNull: ['$substitutions', []] } },
          },
        },
      },
      {
        $project: {
          storeId: '$_id',
          totalOrders: 1,
          breachedOrders: 1,
          slaCompliance: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ['$totalOrders', '$breachedOrders'] }, '$totalOrders'] },
                  100,
                ],
              },
              1,
            ],
          },
          avgDeliverySeconds: { $round: ['$avgDeliverySeconds', 0] },
          avgPickSeconds: { $round: ['$avgPickSeconds', 0] },
          avgPackSeconds: { $round: ['$avgPackSeconds', 0] },
          avgHandoverSeconds: { $round: ['$avgHandoverSeconds', 0] },
          avgRideSeconds: { $round: ['$avgRideSeconds', 0] },
          substitutionsCount: 1,
        },
      },
      { $sort: { slaCompliance: -1 } },
    ];

    return Order.aggregate(pipeline);
  }

  async getPickerLeaderboard(matchFilter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...matchFilter,
          pickerId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$pickerId',
          storeId: { $first: '$storeId' },
          totalOrders: { $sum: 1 },
          breachedOrders: {
            $sum: { $cond: [{ $eq: ['$isBreached', true] }, 1, 0] },
          },
          avgPickSeconds: { $avg: '$stageDurations.pick' },
          totalItemsPicked: { $sum: '$itemCount' },
        },
      },
      {
        $project: {
          pickerId: '$_id',
          storeId: 1,
          totalOrders: 1,
          breachedOrders: 1,
          avgPickSeconds: { $round: ['$avgPickSeconds', 0] },
          totalItemsPicked: 1,
          breachRate: {
            $round: [
              { $multiply: [{ $divide: ['$breachedOrders', '$totalOrders'] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { avgPickSeconds: 1 } },
    ];

    return Order.aggregate(pipeline);
  }
}

export const orderRepo = new OrderRepository();
