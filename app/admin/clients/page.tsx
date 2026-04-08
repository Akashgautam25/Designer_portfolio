"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, FolderKanban, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/clients")
      .then((r) => setClients(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="mt-1 text-muted-foreground">{clients.length} registered clients</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="py-12 text-center text-muted-foreground">No clients yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {c.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{c.name || c.email}</div>
                      <div className="text-sm text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FolderKanban className="h-4 w-4" />
                      {c._count?.projects ?? 0} projects
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {c._count?.messages ?? 0} messages
                    </div>
                    <div className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</div>
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
