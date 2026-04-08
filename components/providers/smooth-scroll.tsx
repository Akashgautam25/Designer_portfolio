"use client"

import { useEffect } from "react"
import { ReactLenis } from "lenis/react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize any global scroll handlers here if needed
  }, [])

  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
