"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  as?: "button" | "div" | "a"
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  as = "button",
  href,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    setPosition({
      x: (clientX - left - width / 2) * strength,
      y: (clientY - top - height / 2) * strength,
    })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  if (as === "a") {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cn("relative inline-flex items-center justify-center", disabled && "opacity-50 cursor-not-allowed", className)}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
        onClick={disabled ? undefined : onClick}
      >
        {children}
      </motion.a>
    )
  }

  if (as === "div") {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn("relative inline-flex items-center justify-center", disabled && "opacity-50 cursor-not-allowed", className)}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
        onClick={disabled ? undefined : onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={cn("relative inline-flex items-center justify-center", disabled && "opacity-50 cursor-not-allowed", className)}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
