import { darkStoreRepo } from '../repositories/darkStore.repo.js';
import { AppError } from '../middlewares/error.middleware.js';

export class StoreService {
  async getAllStores() {
    return darkStoreRepo.findAll();
  }

  async getStoreById(storeId: string) {
    const store = await darkStoreRepo.findByStoreId(storeId);
    if (!store) {
      throw new AppError(`Dark Store ${storeId} not found`, 404);
    }
    return store;
  }
}

export const storeService = new StoreService();
