import { Alert, IAlert } from '../models/Alert.js';

export class AlertRepository {
  async findActive(storeId?: string): Promise<IAlert[]> {
    const filter: Record<string, any> = { resolved: false };
    if (storeId) filter.storeId = storeId;
    return Alert.find(filter).sort({ createdAt: -1 }).limit(50).lean<IAlert[]>();
  }

  async findRecent(storeId?: string, limit = 20): Promise<IAlert[]> {
    const filter: Record<string, any> = {};
    if (storeId) filter.storeId = storeId;
    return Alert.find(filter).sort({ createdAt: -1 }).limit(limit).lean<IAlert[]>();
  }

  async create(data: Partial<IAlert>): Promise<IAlert> {
    return Alert.create(data);
  }

  async resolve(alertId: string, resolvedBy: string): Promise<IAlert | null> {
    return Alert.findOneAndUpdate(
      { alertId },
      { resolved: true, resolvedAt: new Date(), resolvedBy },
      { new: true }
    ).lean<IAlert | null>();
  }
}

export const alertRepo = new AlertRepository();
