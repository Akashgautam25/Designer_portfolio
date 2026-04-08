"use client"

import { useState } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Calendar, MoreHorizontal, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ClientProject } from "@/lib/db"

interface KanbanBoardProps {
  initialProjects: ClientProject[]
}

type Status = ClientProject["status"]

const columns: { id: Status; title: string; color: string }[] = [
  { id: "discovery", title: "Discovery", color: "bg-blue-500" },
  { id: "design", title: "Design", color: "bg-purple-500" },
  { id: "development", title: "Development", color: "bg-orange-500" },
  { id: "review", title: "Review", color: "bg-yellow-500" },
  { id: "complete", title: "Complete", color: "bg-green-500" },
]

export function KanbanBoard({ initialProjects }: KanbanBoardProps) {
  const [projects, setProjects] = useState(initialProjects)

  const getProjectsByStatus = (status: Status) =>
    projects.filter((p) => p.status === status)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnProjects = getProjectsByStatus(column.id)
        
        return (
          <div
            key={column.id}
            className="w-80 shrink-0 rounded-xl border border-border bg-card/50"
          >
            <div className="flex items-center gap-2 border-b border-border p-4">
              <div className={`h-3 w-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {columnProjects.length}
              </Badge>
            </div>

            <div className="min-h-[500px] space-y-3 p-3">
              <AnimatePresence mode="popLayout">
                {columnProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium">
                            {project.title}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {project.description && (
                          <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all ${column.color}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {project.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(project.due_date), "MMM d")}
                            </div>
                          )}
                          {project.budget && (
                            <div className="ml-auto font-medium text-foreground">
                              ${Number(project.budget).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {columnProjects.length === 0 && (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No projects
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
