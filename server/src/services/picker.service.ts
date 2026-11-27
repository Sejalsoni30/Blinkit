import { pickerRepo } from '../repositories/picker.repo.js';
import { orderRepo } from '../repositories/order.repo.js';

export class PickerService {
  async getAllPickers(storeId?: string) {
    return pickerRepo.findAll(storeId);
  }

  async getPickerLeaderboard(storeId?: string) {
    const filter = storeId && storeId !== 'ALL' ? { storeId } : {};
    const leaderboardStats = await orderRepo.getPickerLeaderboard(filter);
    const pickers = await pickerRepo.findAll(storeId && storeId !== 'ALL' ? storeId : undefined);

    const pickerMap = new Map(pickers.map((p) => [p.pickerId, p]));

    return leaderboardStats.map((stat) => {
      const picker = pickerMap.get(stat.pickerId);
      // Realistic calculation: orders picked per hour assuming 8hr shifts
      const estimatedOrdersPerHour = Number((stat.totalOrders / 160).toFixed(1)); // ~20 shift days * 8h

      return {
        pickerId: stat.pickerId,
        name: picker ? picker.name : stat.pickerId,
        storeId: stat.storeId,
        shift: picker ? picker.shift : 'MORNING',
        experienceLevel: picker ? picker.experienceLevel : 'MID',
        rating: picker ? picker.rating : 4.8,
        totalOrders: stat.totalOrders,
        breachedOrders: stat.breachedOrders,
        breachRate: stat.breachRate,
        avgPickSeconds: stat.avgPickSeconds,
        totalItemsPicked: stat.totalItemsPicked,
        ordersPerHour: estimatedOrdersPerHour > 0 ? estimatedOrdersPerHour : 8.5,
      };
    });
  }
}

export const pickerService = new PickerService();
