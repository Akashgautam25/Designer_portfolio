"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "@/components/animations/reveal"
import type { DummyProject } from "@/lib/data"

interface Props {
  project: DummyProject
}

export function ProjectCaseStudy({ project }: Props) {
  const hScrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Horizontal scroll driven by vertical scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${Math.max(0, (project.images.length - 1) * 55)}%`]
  )

  return (
    <>
      {/* About section */}
      <div className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal direction="up">
              <h2 className="text-2xl font-bold">About the Project</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {project.long_description}
              </p>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.15}>
            <div className="space-y-6">
              {/* Technologies */}
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-secondary px-3 py-1 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Year",     value: project.year },
                  { label: "Category", value: project.category },
                  { label: "Client",   value: project.client_name },
                  { label: "Status",   value: "Delivered" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/50 bg-card/50 p-4">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-sm font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Horizontal scroll image gallery */}
      {project.images.length > 1 && (
        <div ref={containerRef} className="relative mt-24 h-[60vh]">
          <div className="sticky top-[20vh] overflow-hidden">
            <Reveal direction="up">
              <p className="mb-6 px-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center">
                Scroll to explore →
              </p>
            </Reveal>
            <motion.div
              ref={hScrollRef}
              style={{ x }}
              className="flex gap-6 px-6 will-change-transform"
            >
              {project.images.map((img, i) => (
                <motion.div
                  key={img}
                  className="relative h-[40vh] w-[80vw] max-w-2xl shrink-0 overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  data-cursor
                  data-cursor-text="View"
                >
                  <Image
                    src={img}
                    alt={`${project.title} — ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="80vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Single image fallback */}
      {project.images.length === 1 && (
        <div className="mx-auto mt-16 max-w-7xl px-6">
          <Reveal direction="up">
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-2xl"
              data-cursor
              data-cursor-text="View"
            >
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>
      )}
    </>
  )
}
