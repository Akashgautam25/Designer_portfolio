import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getProjectBySlug, getAdjacentProjects } from "@/lib/data"
import { Reveal } from "@/components/animations/reveal"
import { SplitText } from "@/components/animations/split-text"
import { ParallaxImage } from "@/components/animations/parallax"

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
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
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
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Client</div>
                <div className="mt-1 font-medium">{project.client_name}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Year</div>
                <div className="mt-1 font-medium">{project.year}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Category</div>
                <div className="mt-1 font-medium">{project.category}</div>
              </div>
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

      {/* Featured Image */}
      <div className="mt-16">
        <ParallaxImage
          src={project.thumbnail_url}
          alt={project.title}
          className="mx-auto aspect-[21/9] max-w-7xl overflow-hidden rounded-xl px-6"
        />
      </div>

      {/* Case Study */}
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal direction="up">
              <h2 className="text-2xl font-bold">About the Project</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{project.long_description}</p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={0.2}>
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-md bg-secondary px-3 py-1 text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Gallery */}
      {project.images.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {project.images.map((image, index) => (
              <Reveal key={image} direction="up" delay={index * 0.1}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mx-auto mt-24 max-w-7xl px-6">
        <div className="flex flex-col gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center md:justify-between">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <div>
                <div className="text-xs uppercase tracking-widest">Previous</div>
                <div className="font-medium text-foreground">{prev.title}</div>
              </div>
            </Link>
          ) : <div />}

          {next && (
            <Link href={`/work/${next.slug}`} className="group flex items-center gap-4 text-right text-muted-foreground transition-colors hover:text-foreground md:flex-row-reverse">
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
