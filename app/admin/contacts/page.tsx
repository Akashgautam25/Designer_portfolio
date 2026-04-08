"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get("/admin/contacts")
      .then((r) => setContacts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="mt-1 text-muted-foreground">{contacts.length} submissions</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="py-12 text-center text-muted-foreground">No contact submissions yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardContent className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-sm text-muted-foreground">{c.email}</span>
                      {c.company && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{c.company}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {c.budget && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{c.budget}</span>}
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">{c.message}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
