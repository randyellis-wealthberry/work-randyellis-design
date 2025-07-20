export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  link: string;
  githubLink?: string;
  video: string;
  thumbnail?: string;
  images: string[];
  timeline: string;
  status: "completed" | "in-progress" | "concept";
  technologies: string[];
  featured: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
  challenges?: string[];
  solutions?: string[];
  learnings?: string[];
  teamSize?: number;
  role?: string;
};

type WorkExperience = {
  company: string;
  title: string;
  start: string;
  end: string;
  link: string;
  id: string;
  description: string[];
};

type BlogPost = {
  title: string;
  description: string;
  link: string;
  uid: string;
};

type SocialLink = {
  label: string;
  link: string;
};

export const PROJECTS: Project[] = [
  {
    id: "project2",
    name: "GrowIt - Social Gardening App",
    slug: "growit",
    description: "One of the fastest-growing mobile gardening apps in the U.S.",
    longDescription:
      "GrowIt is a social gardening platform that connects plant enthusiasts worldwide. Users can share their gardening journey, get expert advice, and discover new plants through an engaging social experience. The app features plant identification, care reminders, and a vibrant community of gardening enthusiasts.",
    category: "Mobile App",
    tags: ["React Native", "Social Platform", "Mobile Design", "Community"],
    link: "https://www.growit.com/",
    githubLink: "https://github.com/example/growit-app",
    video:
      "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0",
    thumbnail: "/images/projects/growit-thumbnail-main.jpg",
    images: [
      "/projects/growit/app-screens.jpg",
      "/projects/growit/user-journey.jpg",
      "/projects/growit/design-system.jpg",
    ],
    timeline: "Q1 2024 - Q3 2024",
    status: "completed",
    technologies: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Firebase",
      "Redux",
    ],
    featured: true,
    metrics: [
      { label: "Active Users", value: "100K+" },
      { label: "App Store Rating", value: "4.8★" },
      { label: "Daily Posts", value: "5K+" },
    ],
    challenges: [
      "Scaling social features for rapid user growth",
      "Implementing real-time plant identification",
      "Creating engaging onboarding for gardening novices",
    ],
    solutions: [
      "Built microservices architecture for better scalability",
      "Integrated ML-powered plant recognition API",
      "Designed progressive onboarding with personalized content",
    ],
    learnings: [
      "Social platform design and community building",
      "Mobile-first development and performance optimization",
      "Machine learning integration in consumer apps",
    ],
    teamSize: 8,
    role: "Product Designer & Frontend Lead",
  },
  {
    id: "project3",
    name: "AI Design System Generator",
    slug: "ai-design-system",
    description:
      "AI-powered tool that generates comprehensive design systems from simple inputs.",
    longDescription:
      "An experimental project exploring how AI can accelerate the design system creation process. The tool analyzes brand guidelines, existing designs, and user requirements to generate a complete design system with components, tokens, and documentation.",
    category: "AI/ML",
    tags: ["AI", "Design Systems", "Automation", "Figma"],
    link: "https://ai-design-system.demo.com/",
    video:
      "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0",
    thumbnail: "/images/projects/ai-design-thumbnail.jpg",
    images: [
      "/projects/ai-design/interface.jpg",
      "/projects/ai-design/generated-system.jpg",
      "/projects/ai-design/workflow.jpg",
    ],
    timeline: "Q4 2024 - Present",
    status: "in-progress",
    technologies: [
      "Python",
      "OpenAI API",
      "Figma API",
      "React",
      "FastAPI",
      "PostgreSQL",
    ],
    featured: false,
    metrics: [
      { label: "Generated Systems", value: "500+" },
      { label: "Time Saved", value: "80%" },
      { label: "Beta Users", value: "150" },
    ],
    challenges: [
      "Training AI to understand design principles",
      "Ensuring generated systems are accessible",
      "Integrating with existing design workflows",
    ],
    solutions: [
      "Curated training data from top design systems",
      "Built-in accessibility validation and testing",
      "Created plugins for popular design tools",
    ],
    learnings: [
      "AI model training and fine-tuning for design tasks",
      "Design system architecture and scalability",
      "API integration with design tools",
    ],
    teamSize: 2,
    role: "Full-stack Developer & AI Researcher",
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: "Wealthberry Labs",
    title: "Head of Product",
    start: "Oct 2022",
    end: "Present",
    link: "https://www.buildyourlegacywithai.com",
    id: "work1",
    description: [
      "Lead product vision for fintech platform, enhancing user experience and increasing retention",
      "Managed teams to achieve 18% conversion from signups to paid waitlist",
      "Conducted 50+ UX sessions to refine features, boosting task completion by 34%",
      "Implemented user-driven development, earning 'intuitive and empowering' feedback",
    ],
  },
  {
    company: "Clockwork",
    title: "Lead UX Researcher",
    start: "Apr 2023",
    end: "Oct 2023",
    link: "https://www.clockwork.com",
    id: "work2",
    description: [
      "Developed wireframes, reducing onboarding time",
      "Interviewed planners to optimize financial tools",
      "Suggested PIM, improving inventory efficiency",
    ],
  },
  {
    company: "Nagarro",
    title: "Head of Design",
    start: "Mar 2022",
    end: "Oct 2022",
    link: "https://www.nagarro.com",
    id: "work3",
    description: [
      "Spearheaded IT firm's design strategy, boosting brand recognition by 50% and generating 100+ leads",
      "Coached 15+ designers, enhancing skills and increasing retention by 40%",
      "Authored 15+ articles, improving site traffic by 40% and boosting leads by 25%",
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Exploring the Intersection of Design, AI, and Design Engineering",
    description: "How AI is changing the way we design",
    link: "/blog/exploring-the-intersection-of-design-ai-and-design-engineering",
    uid: "blog-1",
  },
  {
    title: "Why I left my job to start my own company",
    description:
      "A deep dive into my decision to leave my job and start my own company",
    link: "/blog/exploring-the-intersection-of-design-ai-and-design-engineering",
    uid: "blog-2",
  },
  {
    title: "What I learned from my first year of freelancing",
    description:
      "A look back at my first year of freelancing and what I learned",
    link: "/blog/exploring-the-intersection-of-design-ai-and-design-engineering",
    uid: "blog-3",
  },
  {
    title: "How to Export Metadata from MDX for Next.js SEO",
    description:
      "A guide on exporting metadata from MDX files to leverage Next.js SEO features.",
    link: "/blog/example-mdx-metadata",
    uid: "blog-4",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Github",
    link: "https://github.com/randyellis-wealthberry",
  },
  {
    label: "Twitter",
    link: "https://x.com/iamrandyellis",
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/iamrandyellis/",
  },
];

// Obfuscated email (base64 encoded)
export const EMAIL_ENCODED = "cmFuZHkuZWxsaXMucHJvQGdtYWlsLmNvbQ==";

// Utility function to decode email
export const getEmail = () => {
  if (typeof window === "undefined") {
    // Server-side: use Buffer for Node.js
    return Buffer.from(EMAIL_ENCODED, "base64").toString("utf-8");
  }
  // Client-side: use atob
  return atob(EMAIL_ENCODED);
};

export const PROJECT_CATEGORIES = [
  "All",
  "Web Development",
  "Mobile App",
  "AI/ML",
  "Design Systems",
  "UI/UX",
] as const;
