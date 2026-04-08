'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'page_view',
            page_path: pathname,
            referrer: document.referrer || null,
            metadata: {
              title: document.title,
              screen_width: window.innerWidth,
              screen_height: window.innerHeight,
            },
          }),
        })
      } catch (error) {
        console.error('Analytics tracking error:', error)
      }
    }

    trackPageView()

    // Track clicks
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      const button = target.closest('button')
      
      if (link || button) {
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event_type: 'click',
              page_path: pathname,
              metadata: {
                element: link ? 'link' : 'button',
                text: (link?.textContent || button?.textContent)?.trim().substring(0, 100),
                href: link?.href,
              },
            }),
          })
        } catch (error) {
          console.error('Click tracking error:', error)
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [pathname])

  return null
}
