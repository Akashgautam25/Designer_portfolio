import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SessionProvider } from '@/components/providers/session-provider'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'John Doe | Creative Designer & Developer',
    template: '%s | John Doe',
  },
  description: 'John Doe — award-winning creative designer and developer crafting premium digital experiences.',
  keywords: ['web design', 'UI/UX', 'branding', 'motion design', 'portfolio', 'John Doe'],
  authors: [{ name: 'John Doe' }],
  creator: 'John Doe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'John Doe',
    title: 'John Doe | Creative Designer & Developer',
    description: 'Award-winning creative designer and developer crafting premium digital experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe | Creative Designer & Developer',
    description: 'Award-winning creative designer and developer crafting premium digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0f12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased scrollbar-thin" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SessionProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </SessionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
