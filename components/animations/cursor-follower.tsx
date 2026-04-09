"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CursorFollower() {
  const [visible,    setVisible]    = useState(false)
  const [hovering,   setHovering]   = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [isTouch,    setIsTouch]    = useState(false)

  // Dot — fast, follows cursor directly
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Ring — slow, lags behind (lerp effect)
  const ringX = useSpring(dotX, { damping: 28, stiffness: 180, mass: 0.4 })
  const ringY = useSpring(dotY, { damping: 28, stiffness: 180, mass: 0.4 })

  useEffect(() => {
    if ("ontouchstart" in window) { setIsTouch(true); return }

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    const hover = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-cursor]")
      if (el) {
        setHovering(true)
        setCursorText(el.getAttribute("data-cursor-text") || "")
      } else {
        setHovering(false)
        setCursorText("")
      }
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mousemove", hover)
    document.body.addEventListener("mouseenter", () => setVisible(true))
    document.body.addEventListener("mouseleave", () => setVisible(false))

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousemove", hover)
    }
  }, [dotX, dotY])

  if (isTouch) return null

  return (
    <>
      {/* Dot — sharp, instant */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width:   hovering ? 8  : 6,
          height:  hovering ? 8  : 6,
          opacity: visible  ? 1  : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring — lagging, lerp */}
      <motion.div
        className="pointer-events-none fixed z-[9998] flex items-center justify-center rounded-full border border-foreground/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width:           hovering ? 64  : 36,
          height:          hovering ? 64  : 36,
          opacity:         visible  ? 1   : 0,
          backgroundColor: hovering ? "rgba(124,58,237,0.12)" : "transparent",
          borderColor:     hovering ? "rgb(124,58,237)" : "rgba(255,255,255,0.3)",
        }}
        transition={{ duration: 0.25 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  )
}
