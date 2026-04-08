import { Redis } from "@upstash/redis"

const hasRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

export const redis = hasRedis 
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : {
      // Dummy implementation for local development without Redis
      get: async () => null,
      set: async () => "OK",
      del: async () => 0,
      keys: async () => [],
      hset: async () => 0,
      hgetall: async () => ({}),
      expire: async () => true,
      sadd: async () => 0,
      smembers: async () => [],
      srem: async () => 0,
      publish: async () => 0,
      incr: async () => 1,
      lrange: async () => [],
      lpush: async () => 0,
    } as unknown as Redis


// Cache helpers
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await redis.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const fresh = await fetcher()
  await redis.set(key, fresh, { ex: ttl })
  return fresh
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Session/visitor tracking
export async function trackVisitor(sessionId: string, data: {
  page: string
  userAgent?: string
  country?: string
  city?: string
}) {
  const key = `visitor:${sessionId}`
  await redis.hset(key, {
    ...data,
    lastSeen: Date.now(),
  })
  await redis.expire(key, 300) // 5 minutes
  await redis.sadd("active_visitors", sessionId)
}

export async function getActiveVisitors() {
  const sessionIds = await redis.smembers("active_visitors")
  const visitors = await Promise.all(
    sessionIds.map(async (id) => {
      const data = await redis.hgetall(`visitor:${id}`)
      if (!data || Object.keys(data).length === 0) {
        await redis.srem("active_visitors", id)
        return null
      }
      return { sessionId: id, ...data }
    })
  )
  return visitors.filter(Boolean)
}

// Real-time notifications pub/sub
export async function publishNotification(channel: string, data: unknown) {
  await redis.publish(channel, JSON.stringify(data))
}

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  limit: number,
  window: number
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, window)
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  }
}
