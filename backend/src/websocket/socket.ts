import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import redis from '../config/redis';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env var is required');

const VISITORS_KEY = 'active_visitors';

export const setupWebSocket = (server: HttpServer) => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map((o) => o.trim()).filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on('connection', async (socket) => {
    // ── Authenticate via token query param ──────────────────────────────
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    let userId: string | null = null;
    let userRole: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token as string, JWT_SECRET!) as any;
        userId = decoded.userId;
        userRole = decoded.role;
        // Join personal room for targeted notifications
        socket.join(`user:${userId}`);
        // Admins join the admin room for live metrics
        if (userRole === 'ADMIN') socket.join('admin');
      } catch {
        // Invalid token — treat as anonymous visitor
      }
    }

    // ── Visitor tracking ─────────────────────────────────────────────────
    try {
      await Promise.race([
        redis.incr(VISITORS_KEY),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 500)),
      ]);
      const val = await Promise.race([
        redis.get(VISITORS_KEY),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);
      const count = parseInt(val || '0', 10);
      io.to('admin').emit('visitor-update', { count: Math.max(0, count) });
    } catch {}

    // ── Project room ─────────────────────────────────────────────────────
    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    // ── Disconnect ───────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      try {
        const current = await Promise.race([
          redis.decr(VISITORS_KEY),
          new Promise<number>((resolve) => setTimeout(() => resolve(0), 500)),
        ]);
        const safe = Math.max(0, current);
        io.to('admin').emit('visitor-update', { count: safe });
      } catch {}
    });
  });

  return {
    /** Emit to all sockets in a project room */
    emitToProject: (projectId: string, event: string, data: any) => {
      io.to(`project:${projectId}`).emit(event, data);
    },
    /** Emit to a specific user's personal room */
    emitToUser: (userId: string, event: string, data: any) => {
      io.to(`user:${userId}`).emit(event, data);
    },
    /** Broadcast to all admins */
    emitToAdmins: (event: string, data: any) => {
      io.to('admin').emit(event, data);
    },
    io,
  };
};

let socketEngine: ReturnType<typeof setupWebSocket>;

export const getSocketEngine = () => {
  if (!socketEngine) throw new Error('Socket engine not initialized');
  return socketEngine;
};

export const setSocketEngine = (engine: ReturnType<typeof setupWebSocket>) => {
  socketEngine = engine;
};
