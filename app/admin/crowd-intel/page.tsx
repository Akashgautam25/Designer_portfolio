"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { io, Socket } from "socket.io-client"
import { Radio, MousePointer2, Monitor, Smartphone, Tablet, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function CrowdIntelPage() {
  const [metrics,      setMetrics]      = useState<any>(null)
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [heatmap,      setHeatmap]      = useState<any[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Fetch metrics
    api.get("/admin/metrics").then((r) => {
      setMetrics(r.data)
      setLiveVisitors(r.data.liveVisitors ?? 0)
    }).catch(console.error)

    // Fetch heatmap
    api.get("/admin/heatmap").then((r) => setHeatmap(r.data.points ?? [])).catch(console.error)

    // WebSocket for live visitor count
    const token = localStorage.getItem("auth_token")
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ||
      (process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")) || ""
    const socket = io(wsUrl, { auth: { token } })
    socketRef.current = socket
    socket.on("visitor-update", ({ count }: { count: number }) => setLiveVisitors(count))

    return () => { socket.disconnect() }
  }, [])

  const deviceIcons: Record<string, any> = {
    desktop: Monitor, mobile: Smartphone, tablet: Tablet,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crowd Intel</h1>
        <p className="mt-1 text-muted-foreground">Live visitor tracking, heatmaps & behavior analytics</p>
      </div>

      {/* Live visitors */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-6 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Radio className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <div className="text-5xl font-black text-primary">{liveVisitors}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Live Visitors Right Now</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device breakdown */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {metrics?.deviceBreakdown?.map((d: any, i: number) => {
              const Icon = deviceIcons[d.device?.toLowerCase()] || Monitor
              const total = metrics.deviceBreakdown.reduce((s: number, x: any) => s + x.count, 0)
              const pct = total ? Math.round((d.count / total) * 100) : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize font-medium">{d.device || "unknown"}</span>
                    </div>
                    <span className="text-muted-foreground">{d.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              )
            })}
            {!metrics && <div className="text-sm text-muted-foreground">Loading...</div>}
          </CardContent>
        </Card>

        {/* Traffic sources */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {metrics?.trafficSources?.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{s.source || "Direct"}</span>
                </div>
                <span className="font-bold text-primary">{s.count}</span>
              </div>
            ))}
            {!metrics && <div className="text-sm text-muted-foreground">Loading...</div>}
          </CardContent>
        </Card>
      </div>

      {/* Daily views chart */}
      {metrics?.dailyViews?.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle>Page Views — Last 7 Days</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {metrics.dailyViews.map((d: any, i: number) => {
                const max = Math.max(...metrics.dailyViews.map((x: any) => x.count), 1)
                const h = Math.round((d.count / max) * 100)
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t bg-primary/70"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.date?.slice(5)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heatmap */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer2 className="h-5 w-5 text-primary" />
            Click Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {heatmap.length === 0 ? (
            <p className="text-sm text-muted-foreground">No click data yet. Clicks are tracked automatically as visitors interact with the site.</p>
          ) : (
            <div className="relative h-64 rounded-lg bg-muted/30 overflow-hidden border border-border/50">
              {heatmap.slice(0, 200).map((pt: any, i: number) => (
                <div
                  key={i}
                  className="absolute h-4 w-4 rounded-full bg-primary/40 blur-sm"
                  style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%,-50%)" }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {heatmap.length} click points recorded
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
