"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api-client"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [formData,  setFormData]  = useState({ email: "", password: "" })
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/signup", {
        email:    formData.email,
        password: formData.password,
        role:     "CLIENT",
      })

      const { token, user } = response.data
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === "string" ? msg : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-border/50 bg-card/40 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <UserPlus className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Sign up to access your client dashboard</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-xl border-border/50 bg-background/50 pl-10"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                className="h-12 rounded-xl border-border/50 bg-background/50 pl-10"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-xl font-bold uppercase tracking-widest"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  )
}
