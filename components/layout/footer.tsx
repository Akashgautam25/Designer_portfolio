"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/animations/reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
]

const footerLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* CTA Section */}
          <Reveal direction="up">
            <div className="space-y-6">
              <h2 className="text-balance text-4xl font-bold tracking-tight lg:text-5xl">
                {"Let's work together"}
              </h2>
              <p className="max-w-md text-lg text-muted-foreground">
                Have a project in mind? I&apos;d love to hear about it. Get in touch and let&apos;s create something amazing.
              </p>
              <MagneticButton as="a" href="/contact" strength={0.3}>
                <motion.span
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start a Project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.span>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Links & Social */}
          <Reveal direction="up" delay={0.1}>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <MagneticButton key={social.label} as="a" href={social.href} strength={0.4}>
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </span>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom Bar */}
        <Reveal direction="up" delay={0.2}>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 lg:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} John Doe. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
