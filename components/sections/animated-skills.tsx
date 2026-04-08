"use client"

import { useRef, useEffect } from "react"
import { useInView } from "framer-motion"

const skills = [
  { name: "UI/UX Design", level: 95 },
  { name: "React / Next.js", level: 92 },
  { name: "TypeScript", level: 88 },
  { name: "Motion Design (GSAP)", level: 85 },
  { name: "Brand Identity", level: 82 },
  { name: "Three.js / WebGL", level: 70 },
]

export function AnimatedSkills() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (!isInView) return

    const animate = async () => {
      const gsapMod = await import("gsap")
      const gsap = gsapMod.gsap || gsapMod.default

      const bars = ref.current?.querySelectorAll("[data-skill-bar]")
      bars?.forEach((bar) => {
        const target = bar.getAttribute("data-skill-bar") || "0"
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.1,
          }
        )
      })
    }

    animate()
  }, [isInView])

  return (
    <div ref={ref} className="space-y-6">
      {skills.map((skill) => (
        <div key={skill.name}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">{skill.name}</span>
            <span className="text-muted-foreground">{skill.level}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              data-skill-bar={skill.level}
              className="h-full rounded-full bg-primary"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
