import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';
import { logger } from './logger.js';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    let mongoUri = env.MONGODB_URI;

    if (!mongoUri) {
      logger.info('No MONGODB_URI provided. Starting in-memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      logger.info(`In-memory MongoDB initialized at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    logger.error({ err }, 'Failed to connect to MongoDB');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw err;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      logger.info('In-memory MongoDB server stopped.');
    }
  } catch (err) {
    logger.error({ err }, 'Error disconnecting MongoDB');
  }
};
