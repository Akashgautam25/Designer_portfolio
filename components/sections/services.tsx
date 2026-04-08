"use client"

import { motion } from "framer-motion"
import { Code, Palette, Smartphone, Zap, Globe, Lock } from "lucide-react"
import { Reveal } from "@/components/animations/reveal"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Creating intuitive, user-centered designs that balance aesthetics with functionality.",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Building performant, scalable web applications using modern technologies.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Ensuring seamless experiences across all devices and screen sizes.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Optimizing for speed and efficiency to deliver lightning-fast experiences.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Building inclusive products that everyone can use, regardless of ability.",
  },
  {
    icon: Lock,
    title: "Security",
    description:
      "Implementing best practices to protect your data and users.",
  },
]

export function Services() {
  return (
    <section className="bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Reveal direction="up">
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              What I Do
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight lg:text-5xl">
              Services & Expertise
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              I offer a comprehensive range of services to bring your digital vision to life.
            </p>
          </Reveal>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} direction="up" delay={0.1 * index}>
              <motion.div
                className={cn(
                  "group relative rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/50"
                )}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-primary/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
