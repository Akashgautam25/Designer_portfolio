"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Send, MessageSquare, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/api-client"

export default function MessagesPage() {
  const [projects,        setProjects]        = useState<any[]>([])
  const [messages,        setMessages]        = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [newMessage,      setNewMessage]      = useState("")
  const [sending,         setSending]         = useState(false)
  const [loading,         setLoading]         = useState(true)
  const [currentUser,     setCurrentUser]     = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setCurrentUser(JSON.parse(stored))

    api.get("/projects").then((r) => {
      setProjects(r.data)
      if (r.data.length > 0) setSelectedProject(r.data[0].id)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    api.get(`/messages/${selectedProject}`)
      .then((r) => setMessages(r.data))
      .catch(console.error)
  }, [selectedProject])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || sending) return
    setSending(true)
    try {
      const r = await api.post("/messages", { projectId: selectedProject, content: newMessage.trim() })
      setMessages((prev) => [...prev, r.data])
      setNewMessage("")
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  if (!loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-muted-foreground">Stay in touch with your project team.</p>
        </div>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageSquare className="mb-3 h-10 w-10 opacity-30" />
            <p className="font-medium">No projects yet</p>
            <p className="text-sm">Messages will appear here once you have active projects.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted-foreground">Stay in touch with your project team.</p>
      </div>

      <div className="grid h-[600px] gap-4 lg:grid-cols-4">
        {/* Project list */}
        <div className="rounded-xl border border-border/50 bg-card/50 lg:col-span-1 overflow-hidden flex flex-col">
          <div className="border-b border-border/50 px-4 py-3">
            <p className="text-sm font-semibold">Projects</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selectedProject === p.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex flex-col rounded-xl border border-border/50 bg-card/50 lg:col-span-3 overflow-hidden">
          {/* Header */}
          <div className="border-b border-border/50 px-5 py-3">
            <p className="font-semibold">{selectedProjectData?.title ?? "Select a project"}</p>
            <p className="text-xs text-muted-foreground">{messages.length} messages</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No messages yet — start the conversation
                </div>
              )}
              {[...messages].reverse().map((msg, i) => {
                const isOwn = msg.senderId === currentUser?.id
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {(msg.sender?.email || msg.sender?.name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`mt-1 text-[10px] ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message… (Enter to send)"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
                }}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim() || sending} size="icon" className="h-11 w-11 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
