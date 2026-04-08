"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface CursorFollowerProps {
  className?: string
}

export function CursorFollower({ className }: CursorFollowerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState("")

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Handle hover states
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorHover = target.closest("[data-cursor]")
      
      if (cursorHover) {
        setIsHovering(true)
        const text = cursorHover.getAttribute("data-cursor-text") || ""
        setCursorText(text)
      } else {
        setIsHovering(false)
        setCursorText("")
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousemove", handleHover)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousemove", handleHover)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [cursorX, cursorY])

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null
  }

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full mix-blend-difference transition-all duration-200",
        isVisible ? "opacity-100" : "opacity-0",
        isHovering ? "h-20 w-20 bg-foreground" : "h-8 w-8 border-2 border-foreground",
        className
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {cursorText && (
        <span className="text-xs font-medium text-background">{cursorText}</span>
      )}
    </motion.div>
  )
}
