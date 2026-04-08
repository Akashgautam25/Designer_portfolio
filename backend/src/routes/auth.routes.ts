import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // role is accepted but ADMIN is never allowed via public signup
  role: z.nativeEnum(Role).optional(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, role } = signupSchema.parse(request.body);

      // ── Security: block ADMIN self-registration ──────────────────────
      if (role === Role.ADMIN) {
        return reply.status(403).send({ error: 'Admin accounts cannot be created via signup.' });
      }
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || Role.CLIENT,
        },
      });

      const token = await AuthService.createSession(user.id, user.email, user.role);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.format() });
      }
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);
      
      const user = await AuthService.validateCredentials(email, password);
      if (!user) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const token = await AuthService.createSession(user.userId, user.email, user.role);

      return {
        token,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.format() });
      }
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/logout', { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    await AuthService.logout(user.userId);
    return { success: true };
  });

  fastify.get('/session', { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    return { user };
  });
}
