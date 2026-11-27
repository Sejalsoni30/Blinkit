import { DarkStore, IDarkStore } from '../models/DarkStore.js';

export class DarkStoreRepository {
  async findAll(): Promise<IDarkStore[]> {
    return DarkStore.find({ active: true }).sort({ name: 1 }).lean<IDarkStore[]>();
  }

  async findByStoreId(storeId: string): Promise<IDarkStore | null> {
    return DarkStore.findOne({ storeId, active: true }).lean<IDarkStore | null>();
  }

  async create(data: Partial<IDarkStore>): Promise<IDarkStore> {
    return DarkStore.create(data);
  }

  async count(): Promise<number> {
    return DarkStore.countDocuments();
  }
}

export const darkStoreRepo = new DarkStoreRepository();
