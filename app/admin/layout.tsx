"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard, Users, FolderKanban, BarChart3,
  MousePointer2, Radio, Mail, LogOut, Menu, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Overview",    icon: LayoutDashboard, exact: true },
  { href: "/admin/crowd-intel", label: "Crowd Intel", icon: Radio },
  { href: "/admin/clients",     label: "Clients",     icon: Users },
  { href: "/admin/projects",    label: "Projects",    icon: FolderKanban },
  { href: "/admin/contacts",    label: "Contacts",    icon: Mail },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
        <Link href="/admin" className="text-xl font-black tracking-tighter">
          JD<span className="text-primary">.</span>
          <span className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {active && (
                <motion.div
                  layoutId="admin-indicator"
                  className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready,     setReady]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) { router.push("/login"); return }
    try {
      const u = JSON.parse(stored)
      if (u.role !== "ADMIN") { router.push("/dashboard"); return }
    } catch { router.push("/login"); return }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <AdminSidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
      >
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </motion.aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Admin
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
