import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ── Config ────────────────────────────────────────────────────────────────
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';
const REDIS_URL     = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const MAX_RETRIES   = 3;

// ── Singleton ─────────────────────────────────────────────────────────────
let _redis: Redis | null = null;
let _connected           = false;
let _failed              = false; // stop logging after first failure

function createClient(): Redis {
  const client = new Redis(REDIS_URL, {
    lazyConnect:          true,
    maxRetriesPerRequest: 1,       // fail fast per command
    enableOfflineQueue:   false,   // don't queue commands when disconnected
    retryStrategy(times) {
      if (times >= MAX_RETRIES) {
        if (!_failed) {
          console.warn(`⚠️  Redis unavailable after ${MAX_RETRIES} attempts — running in JWT-only mode`);
          _failed = true;
        }
        return null; // stop retrying
      }
      return Math.min(times * 300, 1000);
    },
  });

  client.on('connect', () => {
    _connected = true;
    _failed    = false;
    console.log('✅ Redis connected');
  });

  client.on('error', (err) => {
    if (!_failed) {
      // Only log the code, not the full stack trace
      console.warn(`⚠️  Redis error [${(err as any).code || err.message}] — falling back to JWT-only mode`);
    }
    _connected = false;
  });

  client.on('close', () => { _connected = false; });

  // Attempt connection (non-blocking — won't throw)
  client.connect().catch(() => {});

  return client;
}

function getRedis(): Redis {
  if (!_redis) _redis = createClient();
  return _redis;
}

// ── Safe wrappers — never throw, never hang ───────────────────────────────
const TIMEOUT_MS = 400;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), TIMEOUT_MS)),
  ]).catch(() => fallback);
}

export const redis = {
  get isConnected() { return _connected; },

  async get(key: string): Promise<string | null> {
    if (!REDIS_ENABLED || !_connected) return null;
    return withTimeout(getRedis().get(key), null);
  },

  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (!REDIS_ENABLED || !_connected) return;
    const cmd = expirySeconds
      ? getRedis().set(key, value, 'EX', expirySeconds)
      : getRedis().set(key, value);
    await withTimeout(cmd, null);
  },

  async setex(key: string, seconds: number, value: string): Promise<void> {
    if (!REDIS_ENABLED || !_connected) return;
    await withTimeout(getRedis().setex(key, seconds, value), null);
  },

  async del(key: string): Promise<void> {
    if (!REDIS_ENABLED || !_connected) return;
    await withTimeout(getRedis().del(key), null);
  },

  async incr(key: string): Promise<number> {
    if (!REDIS_ENABLED || !_connected) return 0;
    return withTimeout(getRedis().incr(key), 0);
  },

  async decr(key: string): Promise<number> {
    if (!REDIS_ENABLED || !_connected) return 0;
    return withTimeout(getRedis().decr(key), 0);
  },

  async rpush(key: string, value: string): Promise<number> {
    if (!REDIS_ENABLED || !_connected) return 0;
    return withTimeout(getRedis().rpush(key, value), 0);
  },

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!REDIS_ENABLED || !_connected) return [];
    return withTimeout(getRedis().lrange(key, start, stop), []);
  },

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    if (!REDIS_ENABLED || !_connected) return;
    await withTimeout(getRedis().ltrim(key, start, stop), null);
  },
};

export default redis;
