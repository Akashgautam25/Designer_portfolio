"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, User, Bell, Shield, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [user,     setUser]     = useState<any>(null)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [name,     setName]     = useState("")
  const [notifs,   setNotifs]   = useState({ email: true, projectUpdates: true, messages: true })
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setName(u.name || u.email?.split("@")[0] || "")
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    // Update local storage name
    if (user) {
      const updated = { ...user, name }
      localStorage.setItem("user", JSON.stringify(updated))
      setUser(updated)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
            <CardDescription>Update your display name and account info.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name || user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                : saved ? "✓ Saved" : "Save Changes"
              }
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle>
            <CardDescription>Choose what notifications you receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email",          label: "Email Notifications",  desc: "Receive notifications via email" },
              { key: "projectUpdates", label: "Project Updates",      desc: "Get notified when projects are updated" },
              { key: "messages",       label: "New Messages",         desc: "Get notified when you receive messages" },
            ].map((item, i) => (
              <div key={item.key}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifs[item.key as keyof typeof notifs]}
                    onCheckedChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Account</CardTitle>
            <CardDescription>Manage your session and account security.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
