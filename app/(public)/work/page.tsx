import { Metadata } from "next"
import { getAllProjects } from "@/lib/data"
import { WorkClient } from "@/components/projects/work-client"

export const metadata: Metadata = {
  title: "Work",
  description: "Explore John Doe's portfolio of award-winning digital projects.",
}

export default function WorkPage() {
  const projects = getAllProjects()
  return <WorkClient projects={projects as any} />
}
