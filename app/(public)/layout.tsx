import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { CursorFollower } from "@/components/animations/cursor-follower"
import { AnalyticsTracker } from "@/components/providers/analytics-tracker"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnalyticsTracker />
      <CursorFollower />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
