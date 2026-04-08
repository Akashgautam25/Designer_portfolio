import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const featured = searchParams.get('featured')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const projects = await sql`
      SELECT * FROM projects
      WHERE 1=1
        ${status ? sql`AND status = ${status}` : sql``}
        ${featured === 'true' ? sql`AND featured = true` : sql``}
        ${category ? sql`AND category = ${category}` : sql``}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      description,
      long_description,
      category,
      tags,
      thumbnail_url,
      images,
      live_url,
      github_url,
      featured,
      status,
    } = body

    const result = await sql`
      INSERT INTO projects (
        title,
        slug,
        description,
        long_description,
        category,
        tags,
        thumbnail_url,
        images,
        live_url,
        github_url,
        featured,
        status
      ) VALUES (
        ${title},
        ${slug},
        ${description},
        ${long_description || null},
        ${category},
        ${tags || []},
        ${thumbnail_url || null},
        ${images || []},
        ${live_url || null},
        ${github_url || null},
        ${featured || false},
        ${status || 'draft'}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
