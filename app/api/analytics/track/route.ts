import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { redis } from '@/lib/redis'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      event_type,
      page_path,
      referrer,
      metadata,
    } = body

    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    // Detect device type from user agent
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
    const isTablet = /tablet|ipad/i.test(userAgent)
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    // Detect browser
    let browser = 'other'
    if (userAgent.includes('Chrome')) browser = 'chrome'
    else if (userAgent.includes('Firefox')) browser = 'firefox'
    else if (userAgent.includes('Safari')) browser = 'safari'
    else if (userAgent.includes('Edge')) browser = 'edge'

    // Insert into database
    await sql`
      INSERT INTO analytics_events (
        event_type,
        page_path,
        referrer,
        user_agent,
        ip_address,
        device_type,
        browser,
        metadata
      ) VALUES (
        ${event_type},
        ${page_path},
        ${referrer || null},
        ${userAgent},
        ${ip},
        ${deviceType},
        ${browser},
        ${JSON.stringify(metadata || {})}
      )
    `

    // Update Redis for real-time tracking
    if (event_type === 'page_view') {
      // Increment live visitors (with 5 min expiry)
      await redis.incr('live_visitors')
      await redis.expire('live_visitors', 300)

      // Track page views
      await redis.hincrby('page_views', page_path, 1)
    }

    // Add to recent events list
    const eventData = JSON.stringify({
      type: event_type,
      path: page_path,
      device: deviceType,
      browser,
      timestamp: new Date().toISOString(),
    })
    await redis.lpush('recent_events', eventData)
    await redis.ltrim('recent_events', 0, 99) // Keep last 100 events

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
