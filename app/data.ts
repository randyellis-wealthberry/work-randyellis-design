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
  overview?: {
    deliverables: string[];
    teamMembers: string[];
    timelineDuration: string;
    toolsUsed: string[];
  };
  constraints?: {
    environmental: string[];
    technical: string[];
    location: string[];
  };
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
    id: "echo-drive",
    name: "EchoDrive - Digital Transformation in Truckload Management",
    slug: "echo",
    description:
      "Modern truckload management platform for Echo Global Logistics, modernizing shipping operations with mobile and web solutions.",
    longDescription:
      "Echo Global Logistics, a leading provider of technology-enabled transportation and supply chain management services, partnered with Eight Bit Studios to modernize their truckload management operations. The shipping industry, long reliant on outdated methods, faced significant challenges in coordinating shippers, drivers, and dispatch teams. EchoDrive was designed to build a modern shipment tracking system that would streamline communication, improve compliance, and drive business growth.",
    category: "Mobile App",
    tags: [
      "Transportation",
      "Logistics",
      "Mobile Native",
      "ELD Compliance",
      "iOS",
      "Android",
    ],
    link: "https://www.echo.com/",
    githubLink: undefined,
    video:
      "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0",
    thumbnail: "/projects/echo/poster.png",
    images: [
      "/projects/echo/img1.jpg",
      "/projects/echo/img2.jpg",
      "/projects/echo/img3.jpg",
      "/projects/echo/img4.jpg",
      "/projects/echo/img5.jpg",
    ],
    timeline: "Q1 2019 - Q4 2019",
    status: "completed",
    technologies: [
      "React Native",
      "iOS",
      "Android",
      "React",
      "Node.js",
      "Electronic Logging",
      "Real-time Tracking",
    ],
    featured: true,
    metrics: [
      { label: "LTL Revenue Increase", value: "$184.4M" },
      { label: "Active Drivers", value: "10K+" },
      { label: "Beta Downloads", value: "1K+" },
      { label: "Shipment Volume Growth", value: "+12%" },
    ],
    challenges: [
      "Achieve compliance with Electronic Logging Device (ELD) Mandate",
      "Enhance truckload visibility to reduce call-center stress",
      "Increase Less Than Truckload (LTL) shipment revenues and volume",
      "Boost driver engagement and modernize legacy workflows",
    ],
    solutions: [
      "Built native mobile app with electronic logging compliance",
      "Implemented real-time shipment tracking and communication platform",
      "Created self-serve booking application for LTL shipments",
      "Developed cohesive web portal for dispatch teams and customer service",
    ],
    learnings: [
      "Transportation industry digital transformation",
      "Regulatory compliance in logistics technology",
      "Driver-dispatcher communication optimization",
      "Mobile-first design for industrial applications",
    ],
    teamSize: 8,
    role: "UX Designer & Product Strategist",
    overview: {
      deliverables: [
        "Discovery & Research",
        "User Journey Mapping",
        "Brand Identity & Strategy",
        "Native Mobile App (iOS/Android)",
        "Web Portal for Dispatch",
        "Interactive Onboarding",
      ],
      teamMembers: [
        "UX Designer (Me)",
        "iOS Developer",
        "Android Developer",
        "Frontend Engineer",
        "Backend Engineer",
        "Product Manager",
        "Visual Designer",
        "QA Engineer",
      ],
      timelineDuration: "12 months",
      toolsUsed: [
        "React Native",
        "React & TypeScript",
        "Node.js & Express",
        "Figma (Design)",
        "Sketch (Prototyping)",
        "InVision (Testing)",
      ],
    },
  },
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
    overview: {
      deliverables: [
        "Lead Product Designer",
        "Features vision and thinking",
        "Evaluative UX Research",
        "User Flow",
        "Interaction Design",
        "Hi-Fi Prototyping",
      ],
      teamMembers: [
        "Software Engineer (iOS + Android)",
        "UX Designer/Researcher (Me)",
        "Visual Designer",
        "Project Manager",
      ],
      timelineDuration: "4-weeks (pilot)",
      toolsUsed: [
        "Adobe Photoshop",
        "InVision (Hi-Fi Prototype)",
        "Miro (Wireframe/Collaboration)",
        "Xtensio (Personas)",
        "Pencil & Pad (Sketching)",
      ],
    },
    constraints: {
      environmental: [
        "Chicago's climate is typically continental with cold winters, warm summers, and frequent short fluctuations in temperature, humidity, cloudiness, and wind direction.",
      ],
      technical: [
        "Signal strength increases as a device moves closer to the beacon, leading to a better proximity estimate.",
        "Physical objects and materials can block signals, reducing the received signal strength.",
        "Human bodies can also block signals",
      ],
      location: [
        "How would we mount the iBeacons?",
        "Can we place them on trees/lampposts /barriers?",
        "Other radio frequencies",
        "If connection drops, what do we show?",
        "Null state",
        "CTA/Null state",
      ],
    },
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
