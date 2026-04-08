import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: "admin" | "client"
  created_at: Date
}

export type Project = {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  images: string[]
  tags: string[]
  category: string | null
  client_name: string | null
  year: number | null
  featured: boolean
  status: "draft" | "published" | "archived"
  sort_order: number
  created_at: Date
  updated_at: Date
}

export type ClientProject = {
  id: string
  user_id: string
  title: string
  description: string | null
  status: "discovery" | "design" | "development" | "review" | "complete"
  progress: number
  start_date: Date | null
  due_date: Date | null
  budget: number | null
  created_at: Date
  updated_at: Date
}

export type File = {
  id: string
  client_project_id: string
  name: string
  url: string
  type: string | null
  size: number | null
  uploaded_by: string
  created_at: Date
}

export type Message = {
  id: string
  client_project_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: Date
}

export type Invoice = {
  id: string
  client_project_id: string
  invoice_number: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  due_date: Date | null
  paid_at: Date | null
  created_at: Date
}

export type AnalyticsEvent = {
  id: string
  event_type: string
  page_path: string
  session_id: string | null
  user_agent: string | null
  ip_address: string | null
  country: string | null
  city: string | null
  device_type: string | null
  referrer: string | null
  metadata: Record<string, unknown>
  created_at: Date
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  read: boolean
  action_url: string | null
  created_at: Date
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  company: string | null
  budget: string | null
  message: string
  status: "new" | "read" | "replied" | "archived"
  created_at: Date
}
