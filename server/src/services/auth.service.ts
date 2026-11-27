import bcrypt from 'bcryptjs';
import { userRepo } from '../repositories/user.repo.js';
import { AppError } from '../middlewares/error.middleware.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '../utils/token.js';
import { IUser } from '../models/User.js';

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      storeId: user.storeId,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepo.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepo.findById(decoded.userId);

      if (!user) {
        throw new AppError('User no longer exists', 401);
      }

      const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        name: user.name,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      await userRepo.updateRefreshToken(user._id.toString(), newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          storeId: user.storeId,
        },
      };
    } catch (err) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string) {
    await userRepo.updateRefreshToken(userId, null);
  }

  async getCurrentUser(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export const authService = new AuthService();
