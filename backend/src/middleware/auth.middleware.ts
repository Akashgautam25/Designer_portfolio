import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import redis from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Redis-backed session check with timeout fallback
    try {
      const storedToken = await Promise.race([
        redis.get(`session:${decoded.userId}`),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);
      if (storedToken && storedToken !== token) {
        return reply.status(401).send({ error: 'Unauthorized: Session invalidated' });
      }
    } catch {
      // Redis down — JWT-only mode, continue
    }

    (request as AuthenticatedRequest).user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  await requireAuth(request, reply);
  if (reply.sent) return;

  const user = (request as AuthenticatedRequest).user;
  if (!user || user.role !== Role.ADMIN) {
    return reply.status(403).send({ error: 'Forbidden: Admin access required' });
  }
};

export const requireClient = async (request: FastifyRequest, reply: FastifyReply) => {
  await requireAuth(request, reply);
  if (reply.sent) return;

  const user = (request as AuthenticatedRequest).user;
  if (!user || user.role !== Role.CLIENT) {
    return reply.status(403).send({ error: 'Forbidden: Client access required' });
  }
};

// Legacy support for authorize (if needed)
export const authorize = (roles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await requireAuth(request, reply);
    if (reply.sent) return;

    const user = (request as AuthenticatedRequest).user;
    if (!user || !roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
    }
  };
};
