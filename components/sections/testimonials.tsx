"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Quote } from "lucide-react"
import { Reveal } from "@/components/animations/reveal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    quote:
      "Working with Studio was an absolute pleasure. They delivered a website that exceeded our expectations and helped us increase conversions by 40%.",
    author: "Sarah Chen",
    role: "CEO, TechStart",
    avatar: "/avatars/sarah.jpg",
  },
  {
    quote:
      "The attention to detail and commitment to quality is unmatched. Our new platform has received countless compliments from users.",
    author: "Michael Rodriguez",
    role: "Product Lead, Innovate Inc",
    avatar: "/avatars/michael.jpg",
  },
  {
    quote:
      "Studio transformed our brand identity and created a digital experience that truly represents who we are. Highly recommended.",
    author: "Emily Johnson",
    role: "Marketing Director, GrowthCo",
    avatar: "/avatars/emily.jpg",
  },
]

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])

  return (
    <section ref={containerRef} className="overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Reveal direction="up">
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              Testimonials
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight lg:text-5xl">
              What Clients Say
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Horizontal Scroll Testimonials */}
      <motion.div style={{ x }} className="flex gap-6 px-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-[400px] shrink-0 rounded-2xl border border-border/50 bg-card p-8 md:w-[500px]"
          >
            <Quote className="mb-4 h-8 w-8 text-primary/30" />
            <blockquote className="mb-6 text-lg leading-relaxed">
              {testimonial.quote}
            </blockquote>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                <AvatarFallback>
                  {testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Duplicate for seamless scroll effect */}
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={`dup-${testimonial.author}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="w-[400px] shrink-0 rounded-2xl border border-border/50 bg-card p-8 md:w-[500px]"
          >
            <Quote className="mb-4 h-8 w-8 text-primary/30" />
            <blockquote className="mb-6 text-lg leading-relaxed">
              {testimonial.quote}
            </blockquote>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                <AvatarFallback>
                  {testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
