"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { MagneticButton } from "@/components/animations/magnetic-button"

export function Hero() {
  const ref        = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLSpanElement>(null)
  const line1Ref   = useRef<HTMLDivElement>(null)
  const line2Ref   = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y       = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [badgeRef, line1Ref, line2Ref, taglineRef, ctaRef, statsRef].forEach((r) => {
        if (r.current) (r.current as HTMLElement).style.opacity = "1"
      })
      return
    }

    let ctx: any

    const init = async () => {
      const gsapMod  = await import("gsap")
      const gsap     = gsapMod.gsap || gsapMod.default
      // animejs v4 uses named exports
      const animeLib = await import("animejs")
      const anime    = (animeLib as any).animate || (animeLib as any).default || animeLib

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // 1. Background fade
        tl.from(bgRef.current, { opacity: 0, duration: 1.2 }, 0)

        // 2. Badge slides down
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.3
        )

        // 3. Line 1 — char-level stagger bounce
        if (line1Ref.current) {
          const chars1 = line1Ref.current.querySelectorAll(".char")
          tl.fromTo(
            chars1,
            { y: 80, opacity: 0, rotateX: -90 },
            {
              y: 0, opacity: 1, rotateX: 0,
              duration: 0.7,
              stagger: 0.04,
              ease: "back.out(1.4)",
            },
            0.5
          )
        }

        // 4. Line 2 — clip-path reveal
        if (line2Ref.current) {
          tl.fromTo(
            line2Ref.current,
            { clipPath: "inset(0 100% 0 0)", opacity: 1 },
            { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power4.inOut" },
            0.9
          )
        }

        // 5. Tagline horizontal reveal
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.3
        )

        // 6. CTA buttons scale in
        if (ctaRef.current) {
          const btns = ctaRef.current.querySelectorAll(".cta-btn")
          tl.fromTo(
            btns,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.12, duration: 0.5, ease: "back.out(2)" },
            1.6
          )
        }

        // 7. Stats counter animate
        if (statsRef.current) {
          tl.fromTo(
            statsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            1.9
          )

          // Counter increment via GSAP
          const counters = statsRef.current.querySelectorAll("[data-count]")
          counters.forEach((el) => {
            const target = parseInt(el.getAttribute("data-count") || "0", 10)
            const obj    = { val: 0 }
            gsap.to(obj, {
              val: target,
              duration: 1.4,
              delay: 2.0,
              ease: "power2.out",
              onUpdate: () => { el.textContent = Math.round(obj.val) + "+" },
            })
          })
        }
      })
    }

    init()
    return () => ctx?.revert()
  }, [])

  // Split text into char spans for GSAP targeting
  const splitChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ display: "inline-block", willChange: "transform, opacity" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated background */}
      <div ref={bgRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
        <motion.div
          className="absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <span
          ref={badgeRef}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm"
          style={{ opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Available for new projects
        </span>

        {/* Heading line 1 — char split */}
        <div className="mt-4 overflow-hidden">
          <div
            ref={line1Ref}
            className="text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ lineHeight: 1, perspective: "800px" }}
            aria-label="Crafting Digital"
          >
            {splitChars("Crafting Digital")}
          </div>
        </div>

        {/* Heading line 2 — clip-path reveal */}
        <div className="overflow-hidden">
          <div
            ref={line2Ref}
            className="text-6xl font-black tracking-tighter text-primary sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ lineHeight: 1, clipPath: "inset(0 100% 0 0)" }}
          >
            Experiences
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl"
          style={{ opacity: 0 }}
        >
          Creative Designer &amp; Developer crafting{" "}
          <span className="text-primary font-semibold">premium digital experiences</span>
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton as="a" href="/work" strength={0.3}>
            <span
              className="cta-btn group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 hover:shadow-xl"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              View Work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </MagneticButton>

          <MagneticButton as="a" href="/contact" strength={0.3}>
            <span
              className="cta-btn inline-flex items-center gap-2 rounded-full border-2 border-border px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              Hire Me
            </span>
          </MagneticButton>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-20 flex flex-wrap items-center justify-center gap-12 md:gap-20"
          style={{ opacity: 0 }}
        >
          {[
            { value: 50, label: "Projects Completed" },
            { value: 5,  label: "Years Experience" },
            { value: 30, label: "Happy Clients" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black text-primary md:text-5xl">
                <span data-count={stat.value}>0+</span>
              </div>
              <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
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
