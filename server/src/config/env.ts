import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5050'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z.string().default('blinkit-dark-store-super-secret-jwt-key-2026'),
  JWT_REFRESH_SECRET: z.string().default('blinkit-dark-store-refresh-secret-jwt-key-2026'),
  CORS_ORIGIN: z.string().default('http://localhost:5174'),
  ML_SERVICE_URL: z.string().default('http://localhost:8000'),
});

export const env = envSchema.parse(process.env);
