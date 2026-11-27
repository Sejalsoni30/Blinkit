import { describe, it, expect } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  TokenPayload,
} from '../utils/token.js';

describe('JWT Token Utilities', () => {
  const payload: TokenPayload = {
    userId: 'user-123456',
    email: 'test@blinkit.com',
    role: 'MANAGER',
    storeId: 'BLR-KOR-01',
    name: 'Test Manager',
  };

  it('should generate and verify access tokens correctly', () => {
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.storeId).toBe(payload.storeId);
  });

  it('should generate and verify refresh tokens correctly', () => {
    const token = generateRefreshToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});
