"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FolderKanban, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api-client"

const STATUS_COLORS: Record<string, string> = {
  briefing:    "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  review:      "bg-violet-500/10 text-violet-500 border-violet-500/20",
  done:        "bg-green-500/10 text-green-500 border-green-500/20",
  draft:       "bg-muted text-muted-foreground border-border",
  published:   "bg-primary/10 text-primary border-primary/20",
}

const STATUS_LABELS: Record<string, string> = {
  briefing: "Briefing", in_progress: "In Progress", review: "Review",
  done: "Done", draft: "Draft", published: "Published",
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get("/projects")
      .then((r) => setProjects(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-muted-foreground">Track and manage your active projects.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FolderKanban className="mb-3 h-10 w-10 opacity-30" />
            <p className="font-medium">No projects yet</p>
            <p className="text-sm">Your projects will appear here once created.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{p.title}</CardTitle>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[p.status] || STATUS_COLORS.draft}`}>
                      {STATUS_LABELS[p.status] || p.status}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{p.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {p.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    )}
                    {p.budget && (
                      <div className="flex items-center gap-1 ml-auto font-medium text-foreground">
                        <DollarSign className="h-3 w-3" />
                        {Number(p.budget).toLocaleString()}
                      </div>
                    )}
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
