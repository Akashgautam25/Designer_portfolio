import { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      // Send initial connection success
      sendEvent('connected', { status: 'ok', timestamp: Date.now() })

      // Poll for updates every 3 seconds
      const interval = setInterval(async () => {
        try {
          // Get live visitor count from Redis
          const visitorCount = await redis.get('live_visitors') || 0
          
          // Get recent analytics events
          const recentEvents = await redis.lrange('recent_events', 0, 9) || []
          
          // Get notifications
          const notifications = await redis.lrange('notifications', 0, 4) || []

          sendEvent('update', {
            visitors: Number(visitorCount),
            recentEvents: recentEvents.map((e: string) => {
              try {
                return JSON.parse(e)
              } catch {
                return e
              }
            }),
            notifications: notifications.map((n: string) => {
              try {
                return JSON.parse(n)
              } catch {
                return n
              }
            }),
            timestamp: Date.now(),
          })
        } catch (error) {
          console.error('SSE update error:', error)
        }
      }, 3000)

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
