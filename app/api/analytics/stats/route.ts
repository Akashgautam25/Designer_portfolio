import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get real-time visitor count
    const liveVisitors = await redis.get('live_visitors') || 0

    // Get today's stats
    const todayStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
        AVG(CASE WHEN event_type = 'session_end' THEN 
          EXTRACT(EPOCH FROM (created_at - (metadata->>'session_start')::timestamp))
        END) as avg_session_duration
      FROM analytics_events
      WHERE created_at >= ${today.toISOString()}
        AND created_at < ${tomorrow.toISOString()}
    `

    // Get device breakdown
    const deviceStats = await sql`
      SELECT 
        device_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${today.toISOString()}
        AND event_type = 'page_view'
      GROUP BY device_type
    `

    // Get browser stats
    const browserStats = await sql`
      SELECT 
        browser,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${today.toISOString()}
        AND event_type = 'page_view'
      GROUP BY browser
    `

    // Get top pages
    const topPages = await sql`
      SELECT 
        page_path,
        COUNT(*) as views
      FROM analytics_events
      WHERE created_at >= ${today.toISOString()}
        AND event_type = 'page_view'
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 10
    `

    // Get hourly traffic for today
    const hourlyTraffic = await sql`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as views
      FROM analytics_events
      WHERE created_at >= ${today.toISOString()}
        AND event_type = 'page_view'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `

    // Get recent events from Redis
    const recentEvents = await redis.lrange('recent_events', 0, 19) || []

    return NextResponse.json({
      live: Number(liveVisitors),
      today: {
        pageViews: Number(todayStats[0]?.page_views || 0),
        uniqueVisitors: Number(todayStats[0]?.unique_visitors || 0),
        clicks: Number(todayStats[0]?.clicks || 0),
        avgSessionDuration: Number(todayStats[0]?.avg_session_duration || 0),
      },
      devices: deviceStats.reduce((acc: Record<string, number>, d: Record<string, unknown>) => {
        acc[d.device_type as string] = Number(d.count)
        return acc
      }, {}),
      browsers: browserStats.reduce((acc: Record<string, number>, b: Record<string, unknown>) => {
        acc[b.browser as string] = Number(b.count)
        return acc
      }, {}),
      topPages: topPages.map((p: Record<string, unknown>) => ({
        path: p.page_path,
        views: Number(p.views),
      })),
      hourlyTraffic: hourlyTraffic.map((h: Record<string, unknown>) => ({
        hour: Number(h.hour),
        views: Number(h.views),
      })),
      recentEvents: recentEvents.map((e: string) => {
        try {
          return JSON.parse(e)
        } catch {
          return e
        }
      }),
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
