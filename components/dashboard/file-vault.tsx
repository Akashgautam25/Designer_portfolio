"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  Download,
  Search,
  Grid,
  List,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { File as FileType, ClientProject } from "@/lib/db"

interface FileVaultProps {
  files: (FileType & { project_title: string })[]
  projects: ClientProject[]
}

const getFileIcon = (type: string | null) => {
  if (!type) return File
  if (type.includes("image")) return FileImage
  if (type.includes("video")) return FileVideo
  if (type.includes("pdf") || type.includes("document")) return FileText
  return File
}

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "Unknown"
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function FileVault({ files, projects }: FileVaultProps) {
  const [search, setSearch] = useState("")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase())
    const matchesProject =
      projectFilter === "all" || file.client_project_id === projectFilter
    return matchesSearch && matchesProject
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Count */}
      <p className="text-sm text-muted-foreground">
        {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
      </p>

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type)
                return (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{file.project_title}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(file.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={file.url} download target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    No files found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type)
            return (
              <div
                key={file.id}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="truncate text-sm font-medium">{file.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {file.project_title}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    asChild
                  >
                    <a href={file.url} download target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
          {filteredFiles.length === 0 && (
            <div className="col-span-full flex h-32 items-center justify-center text-muted-foreground">
              No files found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
