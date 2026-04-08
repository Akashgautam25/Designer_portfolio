"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, FolderKanban, Eye, MousePointer2, TrendingUp, Radio } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/metrics")
      .then((r) => setMetrics(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = metrics ? [
    { label: "Live Visitors",   value: metrics.liveVisitors,    icon: Radio,         color: "text-green-500" },
    { label: "Total Page Views",value: metrics.totalPageViews,  icon: Eye,           color: "text-primary" },
    { label: "Total Clicks",    value: metrics.totalClicks,     icon: MousePointer2, color: "text-cyan-500" },
    { label: "Clients",         value: metrics.totalUsers,      icon: Users,         color: "text-violet-500" },
    { label: "Projects",        value: metrics.totalProjects,   icon: FolderKanban,  color: "text-amber-500" },
    { label: "Messages",        value: metrics.totalMessages,   icon: TrendingUp,    color: "text-emerald-500" },
  ] : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-muted-foreground">Real-time site metrics and activity</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{s.value ?? 0}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Top pages */}
      {metrics?.topPages?.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Top Pages</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {metrics.topPages.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-mono text-muted-foreground truncate max-w-xs">{p.page}</span>
                <span className="font-bold text-primary">{p.views} views</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent events */}
      {metrics?.recentEvents?.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {metrics.recentEvents.slice(0, 10).map((e: any) => (
              <div key={e.id} className="flex items-center justify-between text-sm border-b border-border/30 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{e.type}</span>
                  <span className="text-muted-foreground font-mono truncate max-w-xs">{e.page}</span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleTimeString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
