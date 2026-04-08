"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { Reveal } from "@/components/animations/reveal"

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap")
      const gsap = gsapMod.gsap || gsapMod.default

      // GSAP tagline reveal
      if (taglineRef.current) {
        gsap.fromTo(
          taglineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.0, ease: "power3.out" }
        )
      }
    }

    init()
  }, [])

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Violet orb */}
        <motion.div
          className="absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Cyan orb */}
        <motion.div
          className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <Reveal direction="up" delay={0.1}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </span>
        </Reveal>

        {/* Main heading */}
        <Reveal direction="up" delay={0.2}>
          <div className="mt-4">
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl" style={{ lineHeight: 1 }}>
              Crafting Digital
            </h1>
            <h1 className="text-6xl font-black tracking-tighter text-primary sm:text-7xl md:text-8xl lg:text-9xl" style={{ lineHeight: 1 }}>
              Experiences
            </h1>
          </div>
        </Reveal>

        {/* Tagline — GSAP reveal */}
        <p
          ref={taglineRef}
          className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl"
          style={{ opacity: 0 }}
        >
          Creative Designer & Developer crafting{" "}
          <span className="text-primary font-semibold">premium digital experiences</span>
        </p>

        {/* CTAs */}
        <Reveal direction="up" delay={1.4}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton as="a" href="/work" strength={0.3}>
              <motion.span
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.span>
            </MagneticButton>

            <MagneticButton as="a" href="/contact" strength={0.3}>
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border-2 border-border px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Hire Me
              </motion.span>
            </MagneticButton>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal direction="up" delay={1.6}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "5+", label: "Years Experience" },
              { value: "30+", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black text-primary md:text-5xl">{stat.value}</div>
                <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
