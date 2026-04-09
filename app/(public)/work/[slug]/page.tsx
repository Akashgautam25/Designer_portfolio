import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getProjectBySlug, getAdjacentProjects } from "@/lib/data"
import { Reveal } from "@/components/animations/reveal"
import { SplitText } from "@/components/animations/split-text"
import { ParallaxImage } from "@/components/animations/parallax"
import { ProjectCaseStudy } from "@/components/projects/project-case-study"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  return { title: project.title, description: project.description }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const { prev, next } = getAdjacentProjects(project.id)

  return (
    <article className="pt-32 pb-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6">
        <Reveal direction="up">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Work
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <SplitText className="text-4xl font-bold tracking-tight lg:text-6xl" type="words" tag="h1">
              {project.title}
            </SplitText>
            <Reveal direction="up" delay={0.2}>
              <p className="mt-6 text-lg text-muted-foreground">{project.description}</p>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-wrap gap-6 lg:justify-end">
              {[
                { label: "Client",   value: project.client_name },
                { label: "Year",     value: project.year },
                { label: "Category", value: project.category },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{m.label}</div>
                  <div className="mt-1 font-medium">{m.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Tags */}
        <Reveal direction="up" delay={0.4}>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Featured Image — parallax */}
      <div className="mt-16">
        <ParallaxImage
          src={project.thumbnail_url}
          alt={project.title}
          className="mx-auto aspect-[21/9] max-w-7xl overflow-hidden rounded-xl px-6"
        />
      </div>

      {/* Case study — horizontal scroll gallery + details */}
      <ProjectCaseStudy project={project as any} />

      {/* Navigation */}
      <div className="mx-auto mt-24 max-w-7xl px-6">
        <div className="flex flex-col gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center md:justify-between">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <div>
                <div className="text-xs uppercase tracking-widest">Previous</div>
                <div className="font-medium text-foreground">{prev.title}</div>
              </div>
            </Link>
          ) : <div />}

          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center gap-4 text-right text-muted-foreground transition-colors hover:text-foreground md:flex-row-reverse"
            >
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div>
                <div className="text-xs uppercase tracking-widest">Next</div>
                <div className="font-medium text-foreground">{next.title}</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
