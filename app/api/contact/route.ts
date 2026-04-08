import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { checkRateLimit } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const { allowed } = await checkRateLimit(`contact:${ip}`, 5, 3600) // 5 submissions per hour

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, company, budget, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      )
    }

    // Save to database
    await sql`
      INSERT INTO contact_submissions (name, email, company, budget, message)
      VALUES (${name}, ${email}, ${company || null}, ${budget || null}, ${message})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to submit form." },
      { status: 500 }
    )
  }
}
