"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Send, Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Message, ClientProject } from "@/lib/db"

interface MessagesClientProps {
  messages: (Message & {
    project_title: string
    sender_name: string | null
    sender_avatar: string | null
  })[]
  projects: ClientProject[]
  currentUserId: string
}

export function MessagesClient({
  messages,
  projects,
  currentUserId,
}: MessagesClientProps) {
  const [selectedProject, setSelectedProject] = useState<string>(
    projects[0]?.id || ""
  )
  const [newMessage, setNewMessage] = useState("")
  const [search, setSearch] = useState("")

  const filteredMessages = messages.filter(
    (m) =>
      m.client_project_id === selectedProject &&
      m.content.toLowerCase().includes(search.toLowerCase())
  )

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          content: newMessage,
        }),
      })
      setNewMessage("")
      // In a real app, you'd update the messages list or use SWR/React Query
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-card">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages will appear here once you have active projects.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-[600px] gap-4 lg:grid-cols-4">
      {/* Project Sidebar */}
      <div className="rounded-lg border border-border bg-card lg:col-span-1">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold">Projects</h3>
        </div>
        <ScrollArea className="h-[calc(600px-60px)]">
          <div className="p-2">
            {projects.map((project) => {
              const unreadCount = messages.filter(
                (m) =>
                  m.client_project_id === project.id &&
                  !m.read &&
                  m.sender_id !== currentUserId
              ).length

              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                    selectedProject === project.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="truncate text-sm font-medium">
                    {project.title}
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex flex-col rounded-lg border border-border bg-card lg:col-span-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="font-semibold">
              {selectedProjectData?.title || "Select a project"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {filteredMessages.length} messages
            </p>
          </div>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const isOwn = message.sender_id === currentUserId
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.sender_avatar || ""} />
                    <AvatarFallback>
                      {message.sender_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(message.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              )
            })}
            {filteredMessages.length === 0 && (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No messages yet
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[44px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
