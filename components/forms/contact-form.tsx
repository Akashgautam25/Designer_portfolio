"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import api from "@/lib/api-client"

const MAX_MESSAGE = 500

const budgetOptions = [
  { value: "5k-10k",   label: "$5,000 – $10,000" },
  { value: "10k-25k",  label: "$10,000 – $25,000" },
  { value: "25k-50k",  label: "$25,000 – $50,000" },
  { value: "50k+",     label: "$50,000+" },
  { value: "not-sure", label: "Not sure yet" },
]

// Animated SVG checkmark
function CheckmarkDraw() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none">
      <motion.circle
        cx="26" cy="26" r="25"
        stroke="currentColor" strokeWidth="2"
        className="text-primary"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M14 27l8 8 16-16"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        className="text-primary"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  )
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [focused, setFocused] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", budget: "", message: "",
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const charCount   = formData.message.length
  const charPct     = charCount / MAX_MESSAGE
  const charWarning = charPct >= 0.9

  // Confetti burst on success
  useEffect(() => {
    if (submitStatus !== "success") return
    const run = async () => {
      try {
        const mod = await import("canvas-confetti")
        const confetti = mod.default
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981"],
        })
      } catch {}
    }
    run()
  }, [submitStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    try {
      await api.post("/contact", formData)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", company: "", budget: "", message: "" })
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = (name: string) =>
    `transition-all duration-200 ${
      focused === name
        ? "border-primary ring-2 ring-primary/20 shadow-sm shadow-primary/10"
        : "border-border/50"
    }`

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border/50 bg-card p-8 text-center md:p-12"
      >
        <div className="mx-auto flex justify-center text-primary">
          <CheckmarkDraw />
        </div>
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-2xl font-bold"
        >
          Message Sent!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-2 text-muted-foreground"
        >
          Thank you for reaching out. I&apos;ll get back to you within 24–48 hours.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <Button variant="outline" className="mt-6" onClick={() => setSubmitStatus("idle")}>
            Send Another Message
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            className={fieldClass("name")}
            required
            disabled={isSubmitting}
          />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className={fieldClass("email")}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Your company (optional)"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            onFocus={() => setFocused("company")}
            onBlur={() => setFocused(null)}
            className={fieldClass("company")}
            disabled={isSubmitting}
          />
        </div>
        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Select
            value={formData.budget}
            onValueChange={(v) => setFormData({ ...formData, budget: v })}
            disabled={isSubmitting}
          >
            <SelectTrigger id="budget" className={fieldClass("budget")}>
              <SelectValue placeholder="Select a budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message + char counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">Message *</Label>
          <motion.span
            className={`text-xs font-medium tabular-nums transition-colors ${
              charWarning ? "text-destructive" : "text-muted-foreground"
            }`}
            animate={{ scale: charWarning ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            {charCount}/{MAX_MESSAGE}
          </motion.span>
        </div>
        <div className="relative">
          <Textarea
            id="message"
            placeholder="Tell me about your project..."
            value={formData.message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE)
                setFormData({ ...formData, message: e.target.value })
            }}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
            required
            disabled={isSubmitting}
            rows={6}
            className={`resize-none ${fieldClass("message")}`}
          />
          {/* Progress bar under textarea */}
          <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full transition-colors ${charWarning ? "bg-destructive" : "bg-primary"}`}
              animate={{ width: `${charPct * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            Something went wrong. Please try again.
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="group w-full gap-2 rounded-xl font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20"
      >
        {isSubmitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <>
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
