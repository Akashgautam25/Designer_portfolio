"use client"

import { formatDistanceToNow } from "date-fns"
import { FolderKanban, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { ClientProject } from "@/lib/db"

interface RecentActivityProps {
  projects: ClientProject[]
}

const statusIcons = {
  discovery: Clock,
  design: Clock,
  development: Clock,
  review: AlertCircle,
  complete: CheckCircle,
}

const statusColors = {
  discovery: "text-blue-500",
  design: "text-purple-500",
  development: "text-orange-500",
  review: "text-yellow-500",
  complete: "text-green-500",
}

export function RecentActivity({ projects }: RecentActivityProps) {
  const recentProjects = projects.slice(0, 5)

  if (recentProjects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentProjects.map((project) => {
        const Icon = statusIcons[project.status]
        const colorClass = statusColors[project.status]

        return (
          <div key={project.id} className="flex items-start gap-4">
            <div className={`mt-1 rounded-lg bg-muted p-2 ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{project.title}</p>
              <p className="text-xs text-muted-foreground">
                Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{project.progress}%</div>
              <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
