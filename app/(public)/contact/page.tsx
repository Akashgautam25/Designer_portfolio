import { Metadata } from "next"
import { ContactForm } from "@/components/forms/contact-form"
import { Reveal } from "@/components/animations/reveal"
import { SplitText } from "@/components/animations/split-text"
import { Mail, MapPin, Phone, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to discuss your project. Let's create something amazing together.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@studio.dev",
    href: "mailto:hello@studio.dev",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
  },
  {
    icon: Calendar,
    label: "Availability",
    value: "Taking new projects",
  },
]

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal direction="up">
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              Contact
            </span>
          </Reveal>
          <div className="mt-4">
            <SplitText
              className="text-4xl font-bold tracking-tight lg:text-6xl"
              type="words"
              tag="h1"
            >
              {"Let's work together"}
            </SplitText>
          </div>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a project in mind? I&apos;d love to hear about it. Fill out the form 
              below or reach out directly through any of the channels listed.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Reveal direction="up" delay={0.3}>
              <ContactForm />
            </Reveal>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <Reveal direction="up" delay={0.4}>
              <div className="rounded-2xl border border-border/50 bg-card p-6 md:p-8">
                <h2 className="text-lg font-semibold">Get in Touch</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Prefer to reach out directly? Here&apos;s how you can contact me.
                </p>

                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium transition-colors hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="font-medium">{item.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Response Time */}
                <div className="mt-8 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Typical response time:
                    </span>{" "}
                    I usually respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Social Links */}
            <Reveal direction="up" delay={0.5}>
              <div className="mt-8 rounded-2xl border border-border/50 bg-card p-6 md:p-8">
                <h2 className="text-lg font-semibold">Follow Along</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Stay updated with my latest work and thoughts.
                </p>
                <div className="mt-6 flex gap-4">
                  {[
                    { name: "Twitter", href: "https://twitter.com" },
                    { name: "GitHub", href: "https://github.com" },
                    { name: "LinkedIn", href: "https://linkedin.com" },
                    { name: "Dribbble", href: "https://dribbble.com" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
