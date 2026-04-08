import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { redis } from '@/lib/redis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  try {
    const messages = await sql`
      SELECT 
        m.*,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ${session.user.id} OR m.recipient_id = ${session.user.id})
        ${projectId ? sql`AND m.project_id = ${projectId}` : sql``}
      ORDER BY m.created_at DESC
      LIMIT 50
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { recipientId, projectId, content, attachments } = body

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Recipient and content are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO messages (
        sender_id,
        recipient_id,
        project_id,
        content,
        attachments
      ) VALUES (
        ${session.user.id},
        ${recipientId},
        ${projectId || null},
        ${content},
        ${JSON.stringify(attachments || [])}
      )
      RETURNING *
    `

    // Add notification to Redis for real-time updates
    const notification = JSON.stringify({
      type: 'message',
      from: session.user.name || session.user.email,
      content: content.substring(0, 50),
      timestamp: new Date().toISOString(),
    })
    await redis.lpush(`notifications:${recipientId}`, notification)
    await redis.ltrim(`notifications:${recipientId}`, 0, 49)

    // Add to global notifications for admin
    await redis.lpush('notifications', notification)
    await redis.ltrim('notifications', 0, 49)

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
