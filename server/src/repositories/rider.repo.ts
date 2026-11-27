import { Rider, IRider } from '../models/Rider.js';

export class RiderRepository {
  async findAll(storeId?: string): Promise<IRider[]> {
    const filter = storeId ? { storeId, active: true } : { active: true };
    return Rider.find(filter).sort({ name: 1 }).lean<IRider[]>();
  }

  async findByRiderId(riderId: string): Promise<IRider | null> {
    return Rider.findOne({ riderId }).lean<IRider | null>();
  }
}

export const riderRepo = new RiderRepository();
