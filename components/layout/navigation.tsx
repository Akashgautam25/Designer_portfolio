"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, LayoutDashboard, LogIn, UserPlus, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass py-4 shadow-xl" : "py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.span
              className="text-2xl font-black tracking-tighter uppercase"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              JD<span className="text-primary italic">.</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <MagneticButton key={link.href} as="div" strength={0.2}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative text-sm font-bold tracking-widest uppercase transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </MagneticButton>
              )
            })}
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/50 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative group">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 transition-transform group-hover:scale-105">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-background/80 backdrop-blur-xl border-border/50">
                  <div className="px-3 py-3 mb-2 rounded-lg bg-primary/5">
                    <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="focus:bg-primary/10 rounded-md">
                    <Link href="/dashboard" className="cursor-pointer flex items-center py-2 px-3">
                      <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                      <span className="font-semibold">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild className="focus:bg-primary/10 rounded-md">
                      <Link href="/admin" className="cursor-pointer flex items-center py-2 px-3">
                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                        <span className="font-semibold">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-white focus:bg-destructive rounded-md flex items-center py-2 px-3"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-semibold">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-5">
                <Link href="/login">
                  <MagneticButton as="div" strength={0.3}>
                    <Button variant="outline" className="font-bold uppercase tracking-widest text-xs h-10 px-6 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </MagneticButton>
                </Link>
                <Link href="/signup">
                  <MagneticButton as="div" strength={0.3}>
                    <Button className="font-bold uppercase tracking-widest text-xs h-10 px-6 rounded-full shadow-lg shadow-primary/20">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </MagneticButton>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-10"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-4xl font-black uppercase tracking-tighter transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary italic scale-110" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex flex-col gap-4 w-full px-10"
                >
                  <Link href="/login" className="w-full">
                    <Button variant="outline" size="lg" className="w-full font-bold uppercase py-6 text-lg border-2">
                       Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button size="lg" className="w-full font-bold uppercase py-6 text-lg shadow-xl shadow-primary/30">
                       Sign Up
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
