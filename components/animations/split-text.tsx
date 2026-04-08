"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  staggerChildren?: number
  type?: "words" | "chars" | "lines"
  once?: boolean
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
}

const itemVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
    },
  },
}

export function SplitText({
  children,
  className,
  delay = 0,
  staggerChildren = 0.03,
  type = "words",
  once = true,
  tag: Tag = "p",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        controls.start("visible")
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, controls, delay])

  const splitContent = () => {
    if (type === "chars") {
      return children.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span className="inline-block" variants={itemVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))
    }

    if (type === "lines") {
      return children.split("\n").map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span className="block" variants={itemVariants}>
            {line}
          </motion.span>
        </span>
      ))
    }

    // Default: words
    return children.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
        <motion.span className="inline-block" variants={itemVariants}>
          {word}
        </motion.span>
      </span>
    ))
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("overflow-hidden", className)}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      custom={staggerChildren}
    >
      <Tag className="leading-tight">{splitContent()}</Tag>
    </motion.div>
  )
}
