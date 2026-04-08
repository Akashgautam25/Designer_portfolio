"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { ClientProject } from "@/lib/db"

interface DashboardChartProps {
  projects: ClientProject[]
}

export function DashboardChart({ projects }: DashboardChartProps) {
  // Group projects by status
  const statusCounts = projects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const data = [
    { name: "Discovery", value: statusCounts["discovery"] || 0 },
    { name: "Design", value: statusCounts["design"] || 0 },
    { name: "Development", value: statusCounts["development"] || 0 },
    { name: "Review", value: statusCounts["review"] || 0 },
    { name: "Complete", value: statusCounts["complete"] || 0 },
  ]

  if (projects.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No projects yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar
          dataKey="value"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
