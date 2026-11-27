import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { swaggerSpec } from './swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import orderRoutes from './routes/order.routes.js';
import pickerRoutes from './routes/picker.routes.js';
import productRoutes from './routes/product.routes.js';
import alertRoutes from './routes/alert.routes.js';
import storeRoutes from './routes/store.routes.js';
import predictionRoutes from './routes/prediction.routes.js';
import importRoutes from './routes/import.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // allow swagger ui inline scripts in dev
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Rate Limiting: 600 requests per 15 mins per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api/', limiter);

  // Body parsing & Cookies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Pino HTTP logger
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        autoLogging: {
          ignore: (req) => req.url?.includes('/health') || req.url?.includes('/api/docs'),
        },
      })
    );
  }

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'blinkit-fulfillment-server',
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/pickers', pickerRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/alerts', alertRoutes);
  app.use('/api/v1/stores', storeRoutes);
  app.use('/api/v1/predict', predictionRoutes);
  app.use('/api/v1/import', importRoutes);

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
