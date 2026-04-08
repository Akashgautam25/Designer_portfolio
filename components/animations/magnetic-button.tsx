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
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - left - width / 2) * strength
    const y = (clientY - top - height / 2) * strength
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const Component = as === "a" ? motion.a : as === "div" ? motion.div : motion.button

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement & HTMLButtonElement & HTMLAnchorElement>}
      className={cn(
        "relative inline-flex items-center justify-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      href={href}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </Component>
  )
}
