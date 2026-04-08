"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/db"

interface ProjectCardProps {
  project: Project
  index?: number
  size?: "default" | "large" | "featured"
}

export function ProjectCard({ project, index = 0, size = "default" }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    x.set((mouseX / width) - 0.5)
    y.set((mouseY / height) - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const sizeClasses = {
    default: "aspect-[4/3]",
    large: "aspect-[16/10]",
    featured: "aspect-[16/9] lg:aspect-[21/9]",
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.33, 1, 0.68, 1] }}
      className="group relative"
      style={{
        perspective: 1000,
      }}
    >
      <Link href={`/work/${project.slug}`}>
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-xl bg-card",
            sizeClasses[size]
          )}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          data-cursor
          data-cursor-text="View"
        >
          {/* Image */}
          <div className="absolute inset-0">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
          </div>

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2 flex flex-wrap gap-2"
            >
              {project.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight lg:text-2xl">
                  {project.title}
                </h3>
                {project.client_name && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.client_name}
                    {project.year && ` · ${project.year}`}
                  </p>
                )}
              </div>

              <motion.div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
