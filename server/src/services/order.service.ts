import { orderRepo, OrderFilterParams, PaginationParams } from '../repositories/order.repo.js';
import { AppError } from '../middlewares/error.middleware.js';
import { IOrder } from '../models/Order.js';
import { emitOrderUpdate } from '../sockets/socket.js';

export class OrderService {
  async getOrders(filter: OrderFilterParams, pagination: PaginationParams) {
    return orderRepo.findOrders(filter, pagination);
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await orderRepo.findById(orderId);
    if (!order) {
      throw new AppError(`Order ${orderId} not found`, 404);
    }
    return order;
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    const created = await orderRepo.create(data);
    emitOrderUpdate(created);
    return created;
  }
}

export const orderService = new OrderService();
