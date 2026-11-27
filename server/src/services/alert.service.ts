import { alertRepo } from '../repositories/alert.repo.js';
import { emitNewAlert } from '../sockets/socket.js';
import { IAlert } from '../models/Alert.js';

export class AlertService {
  async getActiveAlerts(storeId?: string) {
    return alertRepo.findActive(storeId && storeId !== 'ALL' ? storeId : undefined);
  }

  async getRecentAlerts(storeId?: string, limit = 20) {
    return alertRepo.findRecent(storeId && storeId !== 'ALL' ? storeId : undefined, limit);
  }

  async createAlert(data: Partial<IAlert>) {
    const alertId = `ALT-${Date.now().toString().slice(-5)}`;
    const alert = await alertRepo.create({
      ...data,
      alertId,
    });
    emitNewAlert(alert);
    return alert;
  }

  async resolveAlert(alertId: string, resolvedBy: string) {
    return alertRepo.resolve(alertId, resolvedBy);
  }
}

export const alertService = new AlertService();
