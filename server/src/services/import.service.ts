import { orderRepo } from '../repositories/order.repo.js';
import { IOrder, DelayReason } from '../models/Order.js';

export class ImportService {
  /**
   * Import orders from parsed CSV rows
   */
  async importOrdersFromRows(rows: any[]) {
    let importedCount = 0;
    const errors: { row: number; error: string }[] = [];
    const ordersToInsert: Partial<IOrder>[] = [];

    rows.forEach((row, idx) => {
      try {
        const orderId = row.orderId || row.order_id || `BLK-IMP-${Date.now().toString().slice(-4)}${idx}`;
        const storeId = row.storeId || row.store_id || 'BLR-KOR-01';
        const itemCount = parseInt(row.itemCount || row.item_count || '1', 10);
        const totalAmount = parseFloat(row.totalAmount || row.total_amount || '199');
        const placedAt = row.placedAt ? new Date(row.placedAt) : new Date();

        const assignSec = parseInt(row.assignDuration || '20', 10);
        const pickSec = parseInt(row.pickDuration || '160', 10);
        const packSec = parseInt(row.packDuration || '45', 10);
        const handoverSec = parseInt(row.handoverDuration || '40', 10);
        const rideSec = parseInt(row.rideDuration || '180', 10);

        const totalDurationSeconds =
          parseInt(row.totalDurationSeconds || '0', 10) ||
          (assignSec + pickSec + packSec + handoverSec + rideSec);

        const isBreached = totalDurationSeconds > 600;
        const delayReason: DelayReason = (row.delayReason as DelayReason) || (isBreached ? 'SLOW_PICK' : 'NONE');

        ordersToInsert.push({
          orderId,
          storeId,
          items: [
            {
              sku: row.sku || 'SKU-1001',
              name: row.productName || 'Imported Product',
              qty: itemCount,
              price: totalAmount,
              aisle: row.aisle || 'Aisle 1',
              rack: row.rack || 'R-01',
            },
          ],
          itemCount,
          totalAmount,
          placedAt,
          deliveredAt: new Date(placedAt.getTime() + totalDurationSeconds * 1000),
          status: 'delivered',
          delayReason,
          isBreached,
          totalDurationSeconds,
          stageDurations: {
            assign: assignSec,
            pick: pickSec,
            pack: packSec,
            handover: handoverSec,
            ride: rideSec,
          },
          aisleSpreadCount: parseInt(row.aisleSpread || '1', 10),
          substitutions: [],
        });

        importedCount++;
      } catch (err: any) {
        errors.push({ row: idx + 1, error: err.message });
      }
    });

    if (ordersToInsert.length > 0) {
      await orderRepo.insertMany(ordersToInsert);
    }

    return {
      importedCount,
      failedCount: errors.length,
      errors: errors.slice(0, 10),
    };
  }

  getSampleCsvTemplate(): string {
    return `orderId,storeId,itemCount,totalAmount,placedAt,assignDuration,pickDuration,packDuration,handoverDuration,rideDuration,delayReason,aisleSpread
BLK-CSV-9001,BLR-KOR-01,4,350,2026-11-20T10:30:00Z,22,145,40,35,170,NONE,2
BLK-CSV-9002,DEL-IND-02,7,820,2026-11-20T19:15:00Z,35,280,110,65,190,PACKING_QUEUE,4
BLK-CSV-9003,MUM-AND-03,3,290,2026-11-21T08:45:00Z,18,120,38,30,165,NONE,1
BLK-CSV-9004,GGN-SEC-04,5,640,2026-11-21T21:00:00Z,28,320,45,180,185,RIDER_WAIT,3
BLK-CSV-9005,HYD-HIT-05,2,180,2026-11-22T14:20:00Z,15,110,30,25,140,NONE,1`;
  }
}

export const importService = new ImportService();
