"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, FileImage, FileVideo, File, Download, Search, Grid, List, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import api from "@/lib/api-client"

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext || "")) return FileImage
  if (["mp4","mov","avi","webm"].includes(ext || "")) return FileVideo
  if (["pdf","doc","docx","txt"].includes(ext || "")) return FileText
  return File
}

function formatSize(bytes?: number | null) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function FilesPage() {
  const [files,   setFiles]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState("")
  const [view,    setView]    = useState<"list" | "grid">("list")

  useEffect(() => {
    // Fetch files for all user projects
    api.get("/projects").then(async (r) => {
      const projects = r.data as any[]
      const allFiles: any[] = []
      await Promise.all(
        projects.map(async (p) => {
          try {
            const fr = await api.get(`/files/project/${p.id}`)
            fr.data.forEach((f: any) => allFiles.push({ ...f, projectTitle: p.title }))
          } catch {}
        })
      )
      setFiles(allFiles)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        <p className="mt-1 text-muted-foreground">Access and download all your project files.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FolderOpen className="mb-3 h-10 w-10 opacity-30" />
            <p className="font-medium">{search ? "No files match your search" : "No files yet"}</p>
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <Card className="border-border/50 bg-card/50">
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
              {filtered.map((f, i) => {
                const Icon = getFileIcon(f.name)
                return (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/50 last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{f.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{f.projectTitle}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatSize(f.size)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={f.url} target="_blank" rel="noreferrer" download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((f, i) => {
            const Icon = getFileIcon(f.name)
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-primary/5">
                      <Icon className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatSize(f.size)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">{f.projectTitle}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                        <a href={f.url} target="_blank" rel="noreferrer" download>
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
