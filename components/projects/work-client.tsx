"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Reveal } from "@/components/animations/reveal"
import { SplitText } from "@/components/animations/split-text"
import { ProjectCard } from "./project-card"
import type { Project } from "@/lib/db"

const CATEGORIES = ["All", "UI/UX", "Branding", "Motion"]

export function WorkClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All")

  const filtered = active === "All"
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Reveal direction="up">
            <span className="text-sm font-medium uppercase tracking-widest text-primary">Portfolio</span>
          </Reveal>
          <div className="mt-4">
            <SplitText className="text-4xl font-bold tracking-tight lg:text-6xl" type="words" tag="h1">
              Selected Work
            </SplitText>
          </div>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground">
              A collection of projects spanning UI/UX design, brand identity, and motion — each one a unique challenge, thoughtfully solved.
            </p>
          </Reveal>
        </div>

        {/* Filter Tabs */}
        <Reveal direction="up" delay={0.3}>
          <div className="mb-12 flex flex-wrap items-center gap-3">
            {CATEGORIES.map((cat) => {
              const count = cat === "All"
                ? projects.length
                : projects.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                >
                  {active === cat && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${active === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {cat}
                    <motion.span
                      key={`${cat}-${count}`}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active === cat ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {count}
                    </motion.span>
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, index) => (
              <div key={project.id} className={index === 0 ? "md:col-span-2" : ""}>
                <ProjectCard
                  project={project}
                  index={index}
                  size={index === 0 ? "featured" : "default"}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <Reveal direction="up" delay={0.3}>
          <div className="mt-24 rounded-2xl border border-border/50 bg-card/50 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Have a project in mind?</h2>
            <p className="mt-3 text-muted-foreground">{"Let's collaborate and create something amazing together."}</p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start a Project
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
