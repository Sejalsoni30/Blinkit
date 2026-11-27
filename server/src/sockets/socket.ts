import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    // Join store room
    socket.on('join_store', (storeId: string) => {
      socket.join(storeId);
      logger.info(`Socket ${socket.id} joined room for store: ${storeId}`);
    });

    socket.on('leave_store', (storeId: string) => {
      socket.leave(storeId);
      logger.info(`Socket ${socket.id} left room for store: ${storeId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};

export const emitNewAlert = (alert: any) => {
  if (!io) return;
  // Broadcast to global channel and specific store room
  io.emit('new_alert', alert);
  if (alert.storeId) {
    io.to(alert.storeId).emit('store_alert', alert);
  }
};

export const emitOrderUpdate = (order: any) => {
  if (!io) return;
  io.emit('order_update', order);
  if (order.storeId) {
    io.to(order.storeId).emit('store_order_update', order);
  }
};
