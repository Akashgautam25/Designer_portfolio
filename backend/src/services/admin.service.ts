import prisma from '../config/database';
import redis from '../config/redis';

export class AdminService {
  // ── Metrics ──────────────────────────────────────────────────────────────
  static async getMetrics() {
    const [
      totalPageViews,
      totalClicks,
      totalUsers,
      totalProjects,
      totalMessages,
      recentEvents,
      topPages,
      deviceBreakdown,
      trafficSources,
      dailyViews,
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: 'page_view' } }),
      prisma.analyticsEvent.count({ where: { type: 'click' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.project.count(),
      prisma.message.count(),

      // Last 20 events
      prisma.analyticsEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, type: true, page: true, device: true, country: true, createdAt: true },
      }),

      // Top pages by view count
      prisma.analyticsEvent.groupBy({
        by: ['page'],
        where: { type: 'page_view' },
        _count: { _all: true },
        orderBy: { _count: { page: 'desc' } },
        take: 10,
      }),

      // Device breakdown
      prisma.analyticsEvent.groupBy({
        by: ['device'],
        _count: { _all: true },
        orderBy: { _count: { device: 'desc' } },
      }),

      // Traffic sources (referrer)
      prisma.analyticsEvent.groupBy({
        by: ['referrer'],
        where: { type: 'page_view' },
        _count: { _all: true },
        orderBy: { _count: { referrer: 'desc' } },
        take: 8,
      }),

      // Daily views last 7 days
      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT DATE(created_at)::text AS date, COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE event_type = 'page_view'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    // Live visitor count from Redis (with timeout — works without Redis)
    let liveVisitors = 0;
    try {
      const val = await Promise.race([
        redis.get('active_visitors'),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);
      liveVisitors = parseInt(val || '0', 10);
    } catch {}

    return {
      liveVisitors,
      totalPageViews,
      totalClicks,
      totalUsers,
      totalProjects,
      totalMessages,
      recentEvents,
      topPages: topPages.map((p) => ({ page: p.page, views: p._count._all })),
      deviceBreakdown: deviceBreakdown.map((d) => ({ device: d.device || 'unknown', count: d._count._all })),
      trafficSources: trafficSources.map((s) => ({ source: s.referrer || 'direct', count: s._count._all })),
      dailyViews: dailyViews.map((d) => ({ date: d.date, count: Number(d.count) })),
    };
  }

  // ── Heatmap ───────────────────────────────────────────────────────────────
  static async getHeatmap(page?: string) {
    const where: any = { type: 'click' };
    if (page) where.page = page;

    const events = await prisma.analyticsEvent.findMany({
      where,
      select: { meta: true, page: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    // Extract x/y coordinates from meta
    const points = events
      .map((e) => {
        const m = e.meta as any;
        if (m?.x !== undefined && m?.y !== undefined) {
          return { x: m.x, y: m.y, page: e.page };
        }
        return null;
      })
      .filter(Boolean);

    return { points, total: points.length };
  }

  // ── Visitors ──────────────────────────────────────────────────────────────
  static async getLiveVisitors() {
    let count = 0;
    try {
      const val = await Promise.race([
        redis.get('active_visitors'),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
      ]);
      count = Math.max(0, parseInt(val || '0', 10));
    } catch {}
    return { count };
  }

  // ── Contact submissions ───────────────────────────────────────────────────
  static async getContactSubmissions() {
    return prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── All clients ───────────────────────────────────────────────────────────
  static async getClients() {
    return prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: { select: { projects: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── All projects (admin view) ─────────────────────────────────────────────
  static async getAllProjects() {
    return prisma.project.findMany({
      include: {
        client: { select: { id: true, email: true, name: true } },
        _count: { select: { files: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
