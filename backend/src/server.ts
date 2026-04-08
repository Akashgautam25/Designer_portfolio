import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import messageRoutes from './routes/message.routes';
import fileRoutes from './routes/file.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';
import invoiceRoutes from './routes/invoice.routes';
import notificationRoutes from './routes/notification.routes';
import contactRoutes from './routes/contact.routes';

import { setupWebSocket, setSocketEngine } from './websocket/socket';
import { startAnalyticsWorker } from './utils/analytics-worker';
import prisma from './config/database';
import { Role } from '@prisma/client';

dotenv.config();

const app = fastify({ logger: true });

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.register(cors, {
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return cb(null, true);
    // In development allow all localhost
    if (process.env.NODE_ENV !== 'production') return cb(null, true);
    // In production only allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`), false);
  },
  credentials: true,
});

// ── Rate limiting ─────────────────────────────────────────────────────────
app.register(rateLimit, {
  max: 200,
  timeWindow: '1 minute',
  // Stricter limit for auth endpoints
  keyGenerator: (req) => {
    if (req.url?.includes('/auth/')) return `auth:${req.ip}`;
    return req.ip;
  },
});

// ── JWT ───────────────────────────────────────────────────────────────────
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}
app.register(jwt, { secret: jwtSecret || 'dev-secret-key-change-in-prod' });

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV || 'development',
}));

// ── Routes ────────────────────────────────────────────────────────────────
app.register(authRoutes,         { prefix: '/api/auth' });
app.register(projectRoutes,      { prefix: '/api/projects' });
app.register(messageRoutes,      { prefix: '/api/messages' });
app.register(fileRoutes,         { prefix: '/api/files' });
app.register(analyticsRoutes,    { prefix: '/api/analytics' });
app.register(adminRoutes,        { prefix: '/api/admin' });
app.register(invoiceRoutes,      { prefix: '/api/invoices' });
app.register(notificationRoutes, { prefix: '/api/notifications' });
app.register(contactRoutes,      { prefix: '/api/contact' });

// ── Seed admin user ───────────────────────────────────────────────────────
async function seedAdmin() {
  const email        = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set — skipping admin seed');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { email, password: passwordHash, role: Role.ADMIN, name: 'John Doe' },
    });
    console.log(`✅ Admin seeded: ${email}`);
  }
}

// ── Start ─────────────────────────────────────────────────────────────────
const start = async (port: number, retries = 0): Promise<void> => {
  try {
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`\n🚀  SERVER READY`);
    console.log(`👉  Local:       http://localhost:${port}`);
    console.log(`👉  Environment: ${process.env.NODE_ENV || 'development'}\n`);

    const engine = setupWebSocket(app.server);
    setSocketEngine(engine);
    startAnalyticsWorker();
    await seedAdmin();

  } catch (err: any) {
    if (err.code === 'EADDRINUSE' && retries < 10) {
      console.warn(`⚠️  Port ${port} busy — trying ${port + 1}`);
      await app.close();
      return start(port + 1, retries + 1);
    }
    app.log.error(err);
    process.exit(1);
  }
};

start(Number(process.env.PORT) || 4000);
