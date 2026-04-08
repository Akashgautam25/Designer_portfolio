"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, LogIn, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api-client"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [formData,  setFormData]  = useState({ email: "", password: "" })
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get("callbackUrl") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/login", {
        email:    formData.email,
        password: formData.password,
      })

      const { token, user } = response.data
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Role-based redirect
      router.push(user.role === "ADMIN" ? "/admin" : callbackUrl)
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === "string" ? msg : "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-background/50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 p-10 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]"
      >
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <LogIn className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="mt-3 text-muted-foreground font-medium">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center text-sm text-destructive font-semibold"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold uppercase tracking-widest rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ShieldCheck className="h-4 w-4 opacity-70" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center text-sm font-medium pt-2">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <a href="/signup" className="text-primary hover:underline font-bold">
            Sign Up
          </a>
        </div>
      </motion.div>
    </div>
  )
}
