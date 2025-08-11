/**
 * MallOS Enterprise - AuthService
 * Handles authentication, JWT, RBAC, MFA, password reset, and session management
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/config/redis';
import { config } from '@/config/config';
import { User, UserRole } from '@/models/User';
import { database } from '@/config/database';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

export class AuthService {
  /**
   * Generate JWT access token
   */
  static generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
      status: user.status,
    };
    return jwt.sign(payload, config.auth.jwtSecret as any, {
      expiresIn: config.auth.jwtExpiresIn,
    } as any)
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };
    return jwt.sign(payload, config.auth.jwtSecret as any, {
      expiresIn: config.auth.jwtRefreshExpiresIn,
    } as any)
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    return jwt.verify(token, config.auth.jwtSecret);
  }

  /**
   * Retrieve user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      const userRepo = database.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });
      return user ?? null;
    } catch (error) {
      logger.error('Failed to retrieve user by ID:', error);
      return null;
    }
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.auth.bcryptRounds);
  }

  /**
   * Compare password
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate MFA code and store in Redis
   */
  static async generateMfaCode(userId: string): Promise<string> {
    const code = crypto.randomInt(100000, 1000000).toString();
    await redis.set(`mfa:${userId}`, code, 'EX', 300); // 5 min expiry
    return code;
  }

  /**
   * Verify MFA code
   */
  static async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    const key = `mfa:${userId}`;
    const stored = await redis.get(key);
    if (stored === code) {
      await redis.del(key);
      return true;
    }
    return false;
  }

  /**
   * Invalidate MFA code
   */
  static async invalidateMfaCode(userId: string): Promise<void> {
    await redis.del(`mfa:${userId}`);
  }

  /**
   * Create session in Redis
   */
  static async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = uuidv4();
    await redis.set(`session:${sessionId}`, JSON.stringify({ userId, ...sessionData }), 'EX', 60 * 60 * 24 * 7); // 7 days
    return sessionId;
  }

  /**
   * Get session from Redis
   */
  static async getSession(sessionId: string): Promise<any> {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Destroy session in Redis
   */
  static async destroySession(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
  }

  /**
   * Check RBAC permission
   */
  static hasRole(user: User, roles: UserRole[]): boolean {
    return roles.includes(user.role);
  }

  /**
   * Initiate password reset (store token in Redis)
   */
  static async initiatePasswordReset(userId: string): Promise<string> {
    const token = uuidv4();
    await redis.set(`reset:${token}`, userId, 'EX', 60 * 30); // 30 min expiry
    return token;
  }

  /**
   * Verify password reset token
   */
  static async verifyPasswordResetToken(token: string): Promise<string | null> {
    const userId = await redis.get(`reset:${token}`);
    return userId;
  }

  /**
   * Invalidate password reset token
   */
  static async invalidatePasswordResetToken(token: string): Promise<void> {
    await redis.del(`reset:${token}`);
  }
}

export default AuthService; 