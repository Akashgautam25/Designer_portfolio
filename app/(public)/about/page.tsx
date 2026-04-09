import { Metadata } from "next"
import Image from "next/image"
import { Reveal } from "@/components/animations/reveal"
import { SplitText } from "@/components/animations/split-text"
import { Parallax } from "@/components/animations/parallax"
import { AnimatedSkills } from "@/components/sections/animated-skills"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about John Doe — designer, developer, and creative thinker.",
}

const experience = [
  {
    year: "2024 – Present",
    role: "Senior Creative Developer",
    company: "Freelance",
    description: "Leading digital experiences for global brands. Specializing in motion-rich interfaces and design systems.",
  },
  {
    year: "2021 – 2024",
    role: "Lead UI/UX Designer",
    company: "Pixel & Co. Agency",
    description: "Shipped 30+ projects for Fortune 500 clients. Built and maintained a cross-functional design system.",
  },
  {
    year: "2019 – 2021",
    role: "Frontend Developer",
    company: "Launchpad Studio",
    description: "Developed the core product used by 100k+ users. Introduced animation-first design culture.",
  },
]

const awards = [
  { title: "Awwwards Site of the Day", year: "2024" },
  { title: "CSS Design Award", year: "2023" },
  { title: "FWA of the Month", year: "2023" },
  { title: "Dribbble Top Designer", year: "2022" },
]

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <Reveal direction="up">
              <span className="text-sm font-medium uppercase tracking-widest text-primary">About Me</span>
            </Reveal>
            <div className="mt-4">
              <SplitText className="text-4xl font-bold tracking-tight lg:text-6xl" type="words" tag="h1">
                Hi, I&apos;m John Doe
              </SplitText>
            </div>
            <Reveal direction="up" delay={0.2}>
              <p className="mt-6 text-lg text-muted-foreground">
                I&apos;m a creative developer and designer based in San Francisco with 5+ years of experience building beautiful, functional digital products. I specialize in UI/UX design, brand identity, and motion — turning complex ideas into elegant, human-centered experiences.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg text-muted-foreground">
                My work has been recognized by Awwwards, CSS Design Awards, and FWA. When I&apos;m not designing, I&apos;m exploring generative art, contributing to open-source, or mentoring emerging designers.
              </p>
            </Reveal>

            {/* Resume CTA */}
            <Reveal direction="up" delay={0.4}>
              <div className="mt-8 flex gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Download Resume
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-border px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
                >
                  Get in Touch
                </a>
              </div>
            </Reveal>
          </div>

          <Parallax speed={0.08}>
            <Reveal direction="right" delay={0.2}>
              <div className="relative mx-auto aspect-[3/4] max-w-[240px] overflow-hidden rounded-2xl lg:max-w-xs">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
                  alt="John Doe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 0vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 rounded-xl border border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Based in</div>
                  <div className="font-semibold">San Francisco, CA</div>
                </div>
              </div>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-32 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal direction="up">
                <span className="text-sm font-medium uppercase tracking-widest text-primary">Expertise</span>
              </Reveal>
              <Reveal direction="up" delay={0.1}>
                <h2 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">Skills & Technologies</h2>
              </Reveal>
              <Reveal direction="up" delay={0.2}>
                <p className="mt-4 text-muted-foreground">
                  Constantly learning and expanding. Here are the tools and technologies I work with most.
                </p>
              </Reveal>
            </div>
            <AnimatedSkills />
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <Reveal direction="up">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Journey</span>
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">Work Experience</h2>
        </Reveal>

        <div className="mt-12">
          {experience.map((exp, index) => (
            <Reveal key={exp.year} direction="up" delay={0.1 * index}>
              <div className="relative border-l-2 border-border pb-12 pl-8 last:pb-0">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                <div className="text-sm font-medium text-primary">{exp.year}</div>
                <h3 className="mt-2 text-xl font-semibold">{exp.role}</h3>
                <div className="mt-1 text-muted-foreground">{exp.company}</div>
                <p className="mt-3 text-muted-foreground">{exp.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <Reveal direction="up">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Recognition</span>
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">Awards & Certifications</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award, index) => (
            <Reveal key={award.title} direction="up" delay={0.1 * index}>
              <div className="rounded-xl border border-border/50 bg-card/50 p-6 transition-colors hover:border-primary/50">
                <div className="text-xs font-medium uppercase tracking-widest text-primary">{award.year}</div>
                <div className="mt-2 font-semibold">{award.title}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Quality First", description: "Every line of code, every design decision is made with care and attention to detail." },
              { title: "User Centered", description: "Great products start with understanding people. I focus on experiences that feel natural and delightful." },
              { title: "Always Learning", description: "Technology evolves rapidly. I stay curious and continuously expand my knowledge." },
            ].map((value, index) => (
              <Reveal key={value.title} direction="up" delay={0.1 * index}>
                <div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
