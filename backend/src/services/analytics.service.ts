import redis from '../config/redis';
import prisma from '../config/database';

const BUFFER_KEY = 'analytics_events_buffer';

export class AnalyticsService {
  static async bufferEvent(data: {
    type: string;
    page: string;
    meta?: any;
    ipHash?: string;
    country?: string;
    device?: string;
    referrer?: string;
    sessionId?: string;
  }) {
    const event = { ...data, createdAt: new Date().toISOString() };
    try {
      await redis.rpush(BUFFER_KEY, JSON.stringify(event));
    } catch {
      // Redis down — write directly to DB
      try {
        await prisma.analyticsEvent.create({ data });
      } catch (dbErr) {
        console.error('Analytics direct DB write failed:', dbErr);
      }
    }
  }

  static async flushEvents() {
    let raw: string[] = [];
    try {
      raw = await redis.lrange(BUFFER_KEY, 0, -1);
    } catch {
      console.warn('Analytics Worker: Redis unavailable, skipping flush.');
      return;
    }
    if (raw.length === 0) return;

    const events = raw.map((e) => {
      const { createdAt, ...rest } = JSON.parse(e);
      return rest;
    });

    try {
      await prisma.analyticsEvent.createMany({ data: events, skipDuplicates: true });
      await redis.ltrim(BUFFER_KEY, raw.length, -1);
      console.log(`Flushed ${raw.length} analytics events`);
    } catch (err) {
      console.error('Analytics flush error:', err);
    }
  }
}
