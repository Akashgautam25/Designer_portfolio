"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PageTransition() {
  const pathname  = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const prevPath  = useRef(pathname)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    const el = curtainRef.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const run = async () => {
      const gsapMod = await import("gsap")
      const gsap    = gsapMod.gsap || gsapMod.default

      gsap.timeline()
        .set(el, { scaleY: 0, transformOrigin: "bottom", display: "block" })
        .to(el, { scaleY: 1, duration: 0.35, ease: "power4.in" })
        .to(el, { scaleY: 0, transformOrigin: "top", duration: 0.35, ease: "power4.out", delay: 0.05 })
        .set(el, { display: "none" })
    }

    run()
  }, [pathname])

  return (
    <div
      ref={curtainRef}
      className="pointer-events-none fixed inset-0 z-[9990] hidden bg-primary"
      style={{ transformOrigin: "bottom" }}
    />
  )
}
