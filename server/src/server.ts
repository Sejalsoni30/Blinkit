import { createServer } from 'http';
import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initSocket } from './sockets/socket.js';
import { seedData } from './scripts/seed.js';

const startServer = async () => {
  try {
    // 1. Connect to Database (auto launches in-memory MongoDB if no URI is provided)
    await connectDB();

    // 2. Auto-seed initial demo dataset if database is empty
    await seedData(false);

    // 3. Create Express App & HTTP Server
    const app = createApp();
    const httpServer = createServer(app);

    // 4. Initialize Real-Time Socket.IO
    initSocket(httpServer);

    const port = parseInt(env.PORT, 10) || 5000;
    httpServer.listen(port, () => {
      logger.info(`⚡ Blinkit Server running in ${env.NODE_ENV} mode on http://localhost:${port}`);
      logger.info(`📖 OpenAPI Swagger docs available at http://localhost:${port}/api/docs`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      httpServer.close(async () => {
        await disconnectDB();
        logger.info('Server closed. Process terminating.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error({ err }, 'Failed to start Blinkit server');
    process.exit(1);
  }
};

startServer();
