import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      statusCode,
    },
    url: req.originalUrl,
    method: req.method,
  }, 'Request error caught by central error handler');

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
