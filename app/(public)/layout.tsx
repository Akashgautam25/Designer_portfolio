import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { CursorFollower } from "@/components/animations/cursor-follower"
import { AnalyticsTracker } from "@/components/providers/analytics-tracker"
import { ScrollProgress } from "@/components/animations/scroll-progress"
import { PageTransition } from "@/components/animations/page-transition"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnalyticsTracker />
      <ScrollProgress />
      <PageTransition />
      <CursorFollower />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
