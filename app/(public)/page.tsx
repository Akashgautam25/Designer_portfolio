import { getFeaturedProjects } from "@/lib/data"
import { Hero } from "@/components/sections/hero"
import { FeaturedWork } from "@/components/sections/featured-work"
import { Services } from "@/components/sections/services"
import { Testimonials } from "@/components/sections/testimonials"

export default function HomePage() {
  const projects = getFeaturedProjects()

  return (
    <>
      <Hero />
      <FeaturedWork projects={projects as any} />
      <Services />
      <Testimonials />
    </>
  )
}
