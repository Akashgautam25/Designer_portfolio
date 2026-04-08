-- Seed portfolio projects
INSERT INTO projects (title, slug, description, long_description, thumbnail, images, tags, technologies, category, featured, status, sort_order) VALUES
(
  'Nebula Dashboard',
  'nebula-dashboard',
  'A next-generation analytics dashboard with real-time data visualization and AI-powered insights.',
  'Nebula Dashboard revolutionizes how teams interact with their data. Built with performance in mind, it handles millions of data points while maintaining smooth 60fps animations. The AI assistant helps users discover patterns and anomalies automatically.',
  '/images/projects/nebula-thumb.jpg',
  ARRAY['/images/projects/nebula-1.jpg', '/images/projects/nebula-2.jpg', '/images/projects/nebula-3.jpg'],
  ARRAY['Dashboard', 'Analytics', 'AI'],
  ARRAY['Next.js', 'TypeScript', 'D3.js', 'TensorFlow.js', 'PostgreSQL'],
  'Web Application',
  true,
  'published',
  1
),
(
  'Meridian E-Commerce',
  'meridian-ecommerce',
  'A luxury fashion e-commerce platform with immersive 3D product views and personalized shopping experiences.',
  'Meridian brings the boutique shopping experience online. Customers can view products in stunning 3D, get AI-powered style recommendations, and enjoy a checkout process that converts 40% better than industry average.',
  '/images/projects/meridian-thumb.jpg',
  ARRAY['/images/projects/meridian-1.jpg', '/images/projects/meridian-2.jpg'],
  ARRAY['E-Commerce', '3D', 'Fashion'],
  ARRAY['Next.js', 'Three.js', 'Stripe', 'Sanity CMS', 'Tailwind CSS'],
  'E-Commerce',
  true,
  'published',
  2
),
(
  'Pulse Health',
  'pulse-health',
  'A comprehensive health tracking platform with wearable integration and predictive health insights.',
  'Pulse Health connects with over 50 wearable devices to provide users with a unified view of their health data. Machine learning models predict potential health issues before they become serious.',
  '/images/projects/pulse-thumb.jpg',
  ARRAY['/images/projects/pulse-1.jpg', '/images/projects/pulse-2.jpg', '/images/projects/pulse-3.jpg'],
  ARRAY['Health', 'IoT', 'Mobile'],
  ARRAY['React Native', 'Node.js', 'GraphQL', 'MongoDB', 'TensorFlow'],
  'Mobile Application',
  true,
  'published',
  3
),
(
  'Atlas CRM',
  'atlas-crm',
  'An intelligent CRM system that automates sales workflows and provides actionable insights.',
  'Atlas CRM uses natural language processing to automatically log customer interactions, score leads, and suggest next best actions. Teams using Atlas see an average 35% increase in sales productivity.',
  '/images/projects/atlas-thumb.jpg',
  ARRAY['/images/projects/atlas-1.jpg', '/images/projects/atlas-2.jpg'],
  ARRAY['CRM', 'Automation', 'B2B'],
  ARRAY['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI'],
  'Web Application',
  false,
  'published',
  4
),
(
  'Vertex Studio',
  'vertex-studio',
  'A collaborative design tool for creating stunning 3D environments and architectural visualizations.',
  'Vertex Studio empowers architects and designers to create photorealistic visualizations in real-time. With built-in collaboration features, teams can work together from anywhere in the world.',
  '/images/projects/vertex-thumb.jpg',
  ARRAY['/images/projects/vertex-1.jpg', '/images/projects/vertex-2.jpg', '/images/projects/vertex-3.jpg'],
  ARRAY['3D', 'Design', 'Collaboration'],
  ARRAY['WebGL', 'Three.js', 'WebRTC', 'Rust', 'WebAssembly'],
  'Creative Tool',
  true,
  'published',
  5
),
(
  'Echo Podcast',
  'echo-podcast',
  'A podcast platform with AI-powered transcription, smart chapters, and seamless cross-device listening.',
  'Echo transforms podcast consumption with automatic transcription, AI-generated summaries, and smart bookmarking. Listeners can search within episodes and pick up exactly where they left off on any device.',
  '/images/projects/echo-thumb.jpg',
  ARRAY['/images/projects/echo-1.jpg', '/images/projects/echo-2.jpg'],
  ARRAY['Audio', 'AI', 'Media'],
  ARRAY['Next.js', 'Whisper AI', 'AWS', 'Redis', 'PostgreSQL'],
  'Media Platform',
  false,
  'published',
  6
)
ON CONFLICT (slug) DO NOTHING;

-- Create admin user placeholder (will be linked via OAuth)
INSERT INTO users (email, name, role) VALUES
('admin@example.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
