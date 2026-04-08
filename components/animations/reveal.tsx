"use client"

import { useRef } from "react"
import { motion, useInView, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  once?: boolean
  amount?: number
}

const getVariants = (direction: string, duration: number): Variants => {
  const distance = 40

  const directions: Record<string, { x?: number; y?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  amount = 0.3,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants(direction, duration)}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
