"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
  offset?: [string, string]
}

function useParallax(
  scrollYProgress: MotionValue<number>,
  speed: number,
  direction: "up" | "down"
) {
  const distance = speed * 100
  return useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [distance, -distance] : [-distance, distance]
  )
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = "up",
  offset = ["start end", "end start"],
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end" | "end start", "start end" | "end start"],
  })

  const y = useParallax(scrollYProgress, speed, direction)

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
