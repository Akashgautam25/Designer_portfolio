import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await sql`
      SELECT id, email, name, avatar_url, role, company, phone, created_at, updated_at
      FROM users
      WHERE id = ${session.user.id}
    `

    if (!user[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, company, phone, avatar_url } = body

    const result = await sql`
      UPDATE users
      SET 
        name = COALESCE(${name}, name),
        company = COALESCE(${company}, company),
        phone = COALESCE(${phone}, phone),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        updated_at = NOW()
      WHERE id = ${session.user.id}
      RETURNING id, email, name, avatar_url, role, company, phone, created_at, updated_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
