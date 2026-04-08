import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import redis from '../config/redis';
import { Role } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface AuthSession {
  userId: string;
  email: string;
  role: Role;
}

export class AuthService {
  private static SESSION_EXPIRY_CLIENT = 7 * 24 * 60 * 60; // 7 days in seconds
  private static SESSION_EXPIRY_ADMIN = 2 * 60 * 60; // 2 hours in seconds

  static async generateToken(payload: AuthSession): Promise<string> {
    const expiry = payload.role === Role.ADMIN ? '2h' : '7d';
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
  }

  static async createSession(userId: string, email: string, role: Role): Promise<string> {
    const token = await this.generateToken({ userId, email, role });
    const expiry = role === Role.ADMIN ? this.SESSION_EXPIRY_ADMIN : this.SESSION_EXPIRY_CLIENT;

    // Fire-and-forget — never block auth on Redis availability
    Promise.race([
      redis.setex(`session:${userId}`, expiry, token),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 500)),
    ]).catch(() => {
      console.warn('⚠️ Redis session store skipped (unavailable) — JWT-only mode');
    });

    return token;
  }

  static async verifySession(userId: string, token: string): Promise<boolean> {
    try {
      const storedToken = await Promise.race([
        redis.get(`session:${userId}`),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);
      return !storedToken || storedToken === token;
    } catch {
      return true; // JWT-only fallback
    }
  }

  static async logout(userId: string): Promise<void> {
    Promise.race([
      redis.del(`session:${userId}`),
      new Promise((_, reject) => setTimeout(() => reject(), 500)),
    ]).catch(() => {});
  }

  static async validateCredentials(email: string, password: string): Promise<AuthSession | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
