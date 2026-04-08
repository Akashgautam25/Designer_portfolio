"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BentoGrid } from "@/components/projects/bento-grid"
import { Reveal } from "@/components/animations/reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"
import type { Project } from "@/lib/db"

interface FeaturedWorkProps {
  projects: Project[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal direction="up">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-primary">
                Selected Work
              </span>
              <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight lg:text-5xl">
                Featured Projects
              </h2>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <MagneticButton as="a" href="/work" strength={0.3}>
              <span className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                View All Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </MagneticButton>
          </Reveal>
        </div>

        {/* Projects Grid */}
        <BentoGrid projects={projects} />
      </div>
    </section>
  )
}
