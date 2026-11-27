import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.js';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowedRoles.join(', ')}] role`,
      });
      return;
    }

    // Store scoping for STORE MANAGER: lock storeId to their assigned store
    if (req.user.role === 'MANAGER' && req.user.storeId) {
      if (req.query.storeId && req.query.storeId !== req.user.storeId) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Managers can only access data for store ${req.user.storeId}`,
        });
        return;
      }
      req.query.storeId = req.user.storeId;
      if (req.body && req.body.storeId) {
        req.body.storeId = req.user.storeId;
      }
    }

    next();
  };
};
