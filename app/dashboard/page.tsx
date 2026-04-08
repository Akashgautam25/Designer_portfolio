"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FolderKanban, FileText, MessageSquare, Receipt, ArrowUpRight, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function DashboardPage() {
  const [projects,  setProjects]  = useState<any[]>([])
  const [invoices,  setInvoices]  = useState<any[]>([])
  const [messages,  setMessages]  = useState<any[]>([])
  const [notifs,    setNotifs]    = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [user,      setUser]      = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))

    Promise.all([
      api.get("/projects").catch(() => ({ data: [] })),
      api.get("/invoices").catch(() => ({ data: [] })),
      api.get("/notifications").catch(() => ({ data: [] })),
    ]).then(([pr, ir, nr]) => {
      setProjects(pr.data)
      setInvoices(ir.data)
      setNotifs(nr.data)
    }).finally(() => setLoading(false))
  }, [])

  const activeProjects  = projects.filter((p) => !["done", "archived"].includes(p.status)).length
  const pendingInvoices = invoices.filter((i) => i.status === "sent" || i.status === "overdue").length
  const unreadNotifs    = notifs.filter((n: any) => !n.read).length

  const stats = [
    { title: "Total Projects",   value: projects.length,  change: `${activeProjects} active`,    icon: FolderKanban },
    { title: "Active Projects",  value: activeProjects,   change: "In progress",                 icon: FileText },
    { title: "Notifications",    value: unreadNotifs,     change: "Unread",                      icon: Bell },
    { title: "Pending Invoices", value: pendingInvoices,  change: "Awaiting payment",            icon: Receipt },
  ]

  const displayName = user?.name || user?.email?.split("@")[0] || "there"

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your projects and activity.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{s.title}</CardTitle>
                <s.icon className="h-4 w-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "—" : s.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project progress */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Project Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-muted/50 animate-pulse" />
              ))
            ) : projects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No projects yet</p>
            ) : (
              projects.slice(0, 5).map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium truncate max-w-[60%]">{p.title}</span>
                    <span className="text-muted-foreground capitalize shrink-0">{p.status?.replace("_", " ")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.progress}% complete</p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
              ))
            ) : invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No invoices yet</p>
            ) : (
              invoices.slice(0, 5).map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium font-mono">{inv.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{inv.project?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${Number(inv.amount).toLocaleString()}</p>
                    <span className={`text-xs font-medium capitalize ${
                      inv.status === "paid" ? "text-green-500" :
                      inv.status === "overdue" ? "text-destructive" : "text-yellow-500"
                    }`}>{inv.status}</span>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
