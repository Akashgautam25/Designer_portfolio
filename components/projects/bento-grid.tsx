"use client"

import { cn } from "@/lib/utils"
import { ProjectCard } from "./project-card"
import type { Project } from "@/lib/db"

interface BentoGridProps {
  projects: Project[]
  className?: string
}

export function BentoGrid({ projects, className }: BentoGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        No projects to display
      </div>
    )
  }

  // Create a visually interesting grid layout
  const getGridClasses = (index: number, total: number) => {
    // First item is always featured (spans 2 columns on larger screens)
    if (index === 0) {
      return "md:col-span-2"
    }
    
    // Every 5th item after the first is also large
    if ((index - 1) % 4 === 3 && index < total - 1) {
      return "md:col-span-2"
    }
    
    return ""
  }

  const getSize = (index: number, total: number): "default" | "large" | "featured" => {
    if (index === 0) return "featured"
    if ((index - 1) % 4 === 3 && index < total - 1) return "large"
    return "default"
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={cn(getGridClasses(index, projects.length))}
        >
          <ProjectCard
            project={project}
            index={index}
            size={getSize(index, projects.length)}
          />
        </div>
      ))}
    </div>
  )
}
