// Dummy data for local development — no DB required
// Structure mirrors the Project type from lib/db.ts

export type DummyProject = {
  id: string
  title: string
  slug: string
  description: string
  long_description: string
  thumbnail_url: string
  images: string[]
  tags: string[]
  technologies: string[]
  category: string
  client_name: string
  year: number
  featured: boolean
  status: "draft" | "published" | "archived"
  sort_order: number
  created_at: Date
  updated_at: Date
}

export const projects: DummyProject[] = [
  {
    id: "1",
    title: "Nebula Dashboard",
    slug: "nebula-dashboard",
    description: "A next-generation analytics dashboard with real-time data visualization and AI-powered insights.",
    long_description: "Nebula Dashboard revolutionizes how teams interact with their data. Built with performance in mind, it handles millions of data points while maintaining smooth 60fps animations. The AI assistant helps users discover patterns and anomalies automatically. The design system was built from scratch with accessibility at its core, ensuring every user can navigate complex data with ease.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    ],
    tags: ["Dashboard", "Analytics", "AI"],
    technologies: ["Next.js", "TypeScript", "D3.js", "TensorFlow.js", "PostgreSQL"],
    category: "UI/UX",
    client_name: "DataFlow Inc.",
    year: 2024,
    featured: true,
    status: "published",
    sort_order: 1,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Meridian E-Commerce",
    slug: "meridian-ecommerce",
    description: "A luxury fashion e-commerce platform with immersive 3D product views and personalized shopping experiences.",
    long_description: "Meridian brings the boutique shopping experience online. Customers can view products in stunning 3D, get AI-powered style recommendations, and enjoy a checkout process that converts 40% better than industry average. The brand identity was crafted to evoke exclusivity while remaining approachable.",
    thumbnail_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    ],
    tags: ["E-Commerce", "3D", "Fashion"],
    technologies: ["Next.js", "Three.js", "Stripe", "Sanity CMS", "Tailwind CSS"],
    category: "Branding",
    client_name: "Meridian Fashion",
    year: 2024,
    featured: true,
    status: "published",
    sort_order: 2,
    created_at: new Date("2024-02-10"),
    updated_at: new Date("2024-02-10"),
  },
  {
    id: "3",
    title: "Pulse Health",
    slug: "pulse-health",
    description: "A comprehensive health tracking platform with wearable integration and predictive health insights.",
    long_description: "Pulse Health connects with over 50 wearable devices to provide users with a unified view of their health data. Machine learning models predict potential health issues before they become serious. The motion design language was carefully crafted to feel calming and trustworthy in a health context.",
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80",
    ],
    tags: ["Health", "IoT", "Mobile"],
    technologies: ["React Native", "Node.js", "GraphQL", "MongoDB", "TensorFlow"],
    category: "Motion",
    client_name: "Pulse Technologies",
    year: 2023,
    featured: true,
    status: "published",
    sort_order: 3,
    created_at: new Date("2023-11-05"),
    updated_at: new Date("2023-11-05"),
  },
  {
    id: "4",
    title: "Atlas CRM",
    slug: "atlas-crm",
    description: "An intelligent CRM system that automates sales workflows and provides actionable insights.",
    long_description: "Atlas CRM uses natural language processing to automatically log customer interactions, score leads, and suggest next best actions. Teams using Atlas see an average 35% increase in sales productivity. The interface was designed to reduce cognitive load while surfacing the most critical information at the right time.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    ],
    tags: ["CRM", "Automation", "B2B"],
    technologies: ["Next.js", "Python", "FastAPI", "PostgreSQL", "OpenAI"],
    category: "UI/UX",
    client_name: "Atlas Solutions",
    year: 2023,
    featured: false,
    status: "published",
    sort_order: 4,
    created_at: new Date("2023-08-20"),
    updated_at: new Date("2023-08-20"),
  },
  {
    id: "5",
    title: "Vertex Studio",
    slug: "vertex-studio",
    description: "A collaborative design tool for creating stunning 3D environments and architectural visualizations.",
    long_description: "Vertex Studio empowers architects and designers to create photorealistic visualizations in real-time. With built-in collaboration features, teams can work together from anywhere in the world. The product identity needed to feel both technical and creative — a balance achieved through a carefully considered visual language.",
    thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1545670723-196ed0954986?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    ],
    tags: ["3D", "Design", "Collaboration"],
    technologies: ["WebGL", "Three.js", "WebRTC", "Rust", "WebAssembly"],
    category: "Branding",
    client_name: "Vertex Labs",
    year: 2023,
    featured: true,
    status: "published",
    sort_order: 5,
    created_at: new Date("2023-06-12"),
    updated_at: new Date("2023-06-12"),
  },
  {
    id: "6",
    title: "Echo Podcast",
    slug: "echo-podcast",
    description: "A podcast platform with AI-powered transcription, smart chapters, and seamless cross-device listening.",
    long_description: "Echo transforms podcast consumption with automatic transcription, AI-generated summaries, and smart bookmarking. Listeners can search within episodes and pick up exactly where they left off on any device. The motion design system uses subtle audio-reactive animations to create an immersive listening experience.",
    thumbnail_url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=80",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80",
    ],
    tags: ["Audio", "AI", "Media"],
    technologies: ["Next.js", "Whisper AI", "AWS", "Redis", "PostgreSQL"],
    category: "Motion",
    client_name: "Echo Media",
    year: 2022,
    featured: false,
    status: "published",
    sort_order: 6,
    created_at: new Date("2022-12-01"),
    updated_at: new Date("2022-12-01"),
  },
  {
    id: "7",
    title: "Solaris Brand Identity",
    slug: "solaris-brand",
    description: "Complete brand identity system for a renewable energy startup — from logo to motion guidelines.",
    long_description: "Solaris needed a brand that communicated both cutting-edge technology and environmental responsibility. The identity system spans logo design, typography, color palette, iconography, and a comprehensive motion language. Every touchpoint was designed to reinforce the brand's core message: clean energy, beautifully delivered.",
    thumbnail_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&q=80",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    ],
    tags: ["Branding", "Identity", "Motion"],
    technologies: ["Figma", "After Effects", "Illustrator"],
    category: "Branding",
    client_name: "Solaris Energy",
    year: 2022,
    featured: false,
    status: "published",
    sort_order: 7,
    created_at: new Date("2022-09-15"),
    updated_at: new Date("2022-09-15"),
  },
  {
    id: "8",
    title: "Kinetic Type System",
    slug: "kinetic-type",
    description: "An experimental motion typography system exploring the intersection of language and movement.",
    long_description: "Kinetic Type is a personal exploration project that pushes the boundaries of typographic animation. Using GSAP and custom WebGL shaders, each letter becomes a living entity that responds to user interaction. The project was featured in several design publications and won a CSS Design Award.",
    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      "https://images.unsplash.com/photo-1545670723-196ed0954986?w=1200&q=80",
    ],
    tags: ["Motion", "Typography", "Experimental"],
    technologies: ["GSAP", "WebGL", "Three.js", "JavaScript"],
    category: "Motion",
    client_name: "Personal Project",
    year: 2022,
    featured: false,
    status: "published",
    sort_order: 8,
    created_at: new Date("2022-05-20"),
    updated_at: new Date("2022-05-20"),
  },
]

export const getFeaturedProjects = () => projects.filter((p) => p.featured && p.status === "published")
export const getAllProjects = () => projects.filter((p) => p.status === "published")
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug && p.status === "published") ?? null
export const getAdjacentProjects = (id: string) => {
  const sorted = getAllProjects().sort((a, b) => a.sort_order - b.sort_order)
  const idx = sorted.findIndex((p) => p.id === id)
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}

// Dummy dashboard data
export const dummyDashboardProjects = [
  { id: "dp1", title: "Brand Refresh", status: "design", progress: 65, due_date: "2025-05-15", budget: 12000 },
  { id: "dp2", title: "Website Redesign", status: "development", progress: 40, due_date: "2025-06-01", budget: 25000 },
  { id: "dp3", title: "Mobile App UI", status: "review", progress: 85, due_date: "2025-04-20", budget: 18000 },
  { id: "dp4", title: "Motion Package", status: "discovery", progress: 15, due_date: "2025-07-10", budget: 8000 },
]

export const dummyMessages = [
  { id: "m1", sender: "John Doe", content: "The latest mockups look great! Can we schedule a review call?", time: "2h ago", read: false },
  { id: "m2", sender: "Sarah Chen", content: "Invoice #INV-004 has been paid. Thank you!", time: "5h ago", read: false },
  { id: "m3", sender: "Michael R.", content: "Approved the final designs. Ready to move to development.", time: "1d ago", read: true },
]
