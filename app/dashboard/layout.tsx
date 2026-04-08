"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

interface StoredUser {
  id: string
  email: string
  role: "CLIENT" | "ADMIN"
  name?: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user,  setUser]  = useState<StoredUser | null>(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token  = localStorage.getItem("auth_token")
    const stored = localStorage.getItem("user")

    // Not logged in → send to login
    if (!token || !stored) {
      router.replace("/login?callbackUrl=/dashboard")
      return
    }

    try {
      const parsed: StoredUser = JSON.parse(stored)

      // Admin trying to access client dashboard → send to admin
      if (parsed.role === "ADMIN") {
        router.replace("/admin")
        return
      }

      setUser(parsed)
      setReady(true)
    } catch {
      router.replace("/login")
    }
  }, [router])

  if (!ready || !user) return null

  // Normalise shape for sidebar/header components
  const userForComponents = {
    id:    user.id,
    name:  user.name ?? user.email.split("@")[0],
    email: user.email,
    image: null,
    role:  user.role.toLowerCase() as "client" | "admin",
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={userForComponents} />
      <div className="flex flex-1 flex-col lg:pl-72">
        <DashboardHeader user={userForComponents} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
