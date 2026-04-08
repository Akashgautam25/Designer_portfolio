"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FolderKanban, Plus, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api-client"

const STATUS_COLORS: Record<string, string> = {
  briefing:    "bg-blue-500/10 text-blue-500",
  in_progress: "bg-amber-500/10 text-amber-500",
  review:      "bg-violet-500/10 text-violet-500",
  done:        "bg-green-500/10 text-green-500",
  draft:       "bg-muted text-muted-foreground",
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get("/admin/projects")
      .then((r) => setProjects(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} total projects</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="py-12 text-center text-muted-foreground">No projects yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FolderKanban className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.title}</div>
                        <div className="text-sm text-muted-foreground">{p.client?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[p.status] || "bg-muted text-muted-foreground"}`}>
                        {p.status}
                      </span>
                      <div className="text-sm text-muted-foreground">{p.progress}%</div>
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
