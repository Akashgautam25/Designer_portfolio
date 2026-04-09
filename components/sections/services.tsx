"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Palette, Smartphone, Zap, Globe, Lock } from "lucide-react"
import { Reveal } from "@/components/animations/reveal"

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    stat: "50+",
    statLabel: "interfaces",
    description: "Creating intuitive, user-centered designs that balance aesthetics with functionality.",
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    icon: Code,
    title: "Web Development",
    stat: "2000+",
    statLabel: "users served",
    description: "Building performant, scalable web applications using modern technologies.",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    stat: "100%",
    statLabel: "mobile-first",
    description: "Ensuring seamless experiences across all devices and screen sizes.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Zap,
    title: "Performance",
    stat: "95+",
    statLabel: "lighthouse score",
    description: "Optimizing for speed and efficiency to deliver lightning-fast experiences.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: Globe,
    title: "Accessibility",
    stat: "AA",
    statLabel: "WCAG compliant",
    description: "Building inclusive products that everyone can use, regardless of ability.",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Lock,
    title: "Security",
    stat: "0",
    statLabel: "breaches",
    description: "Implementing best practices to protect your data and users.",
    color: "from-rose-500/20 to-rose-500/5",
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.33, 1, 0.68, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/40"
      data-cursor
      data-cursor-text={service.title}
    >
      {/* Gradient bg on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative z-10">
        {/* Icon with spin on hover */}
        <motion.div
          className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary"
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <service.icon className="h-6 w-6" />
        </motion.div>

        {/* Stat */}
        <div className="mb-1 text-2xl font-black text-primary">{service.stat}</div>
        <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{service.statLabel}</div>

        <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
        <p className="text-sm text-muted-foreground">{service.description}</p>
      </div>

      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-primary/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  )
}

export function Services() {
  return (
    <section className="bg-card/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <Reveal direction="up">
            <span className="text-sm font-medium uppercase tracking-widest text-primary">What I Do</span>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight lg:text-5xl">
              Services &amp; Expertise
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A comprehensive range of services to bring your digital vision to life.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
