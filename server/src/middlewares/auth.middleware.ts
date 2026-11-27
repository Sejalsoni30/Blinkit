import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
    });
  }
};
