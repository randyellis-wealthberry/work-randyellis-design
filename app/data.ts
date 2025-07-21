export type Project = {
  id: string;
  name: string;
  subtitle?: string;
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
    environmental?: string[];
    technical?: string[];
    location?: string[];
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
    name: "EchoDrive",
    subtitle: "Digital Truckload Management",
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
    video: "/video.mp4",
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
    name: "GrowIt",
    subtitle: "Social Gardening App",
    slug: "growit",
    description: "One of the fastest-growing mobile gardening apps in the U.S.",
    longDescription:
      "GrowIt is a social gardening platform that connects plant enthusiasts worldwide. Users can share their gardening journey, get expert advice, and discover new plants through an engaging social experience. The app features plant identification, care reminders, and a vibrant community of gardening enthusiasts.",
    category: "Mobile App",
    tags: ["React Native", "Social Platform", "Mobile Design", "Community"],
    link: "https://www.growit.com/",
    githubLink: "https://github.com/example/growit-app",
    video:
      "https://player.vimeo.com/video/799152976?background=1&api=1&player_id=799152976_1676475040264&autopause=0&autoplay=1&mute=1&badge=0&loop=1&portrait=0&title=0&origin=https://work.randyellis.design",
    thumbnail: "/images/projects/growit-thumbnail.jpg",
    images: [
      "/projects/growit/hero-mockup.jpg",
      "/projects/growit/app-screens-overview.jpg",
      "/projects/growit/ui-design.jpg",
      "/projects/growit/persona-research.png",
      "/projects/growit/wireframe-sketches.png",
      "/projects/growit/app-mockup-1.jpg",
    ],
    timeline: "Q1 2025 - Q3 2025",
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
    title:
      "When AI Finally Gets It Right: Phion Just Made Me Forget Why I Hate Setup",
    description:
      "How Phion revolutionized the development experience by eliminating setup friction and letting developers focus on creation.",
    link: "/blog/when-ai-gets-it-right-phion",
    uid: "blog-7",
  },
  {
    title:
      "PROFITS, NOT PIXELS: The story of world's most expensive (yet, valuable?) cup of coffee",
    description:
      "How the design job market has shifted from aesthetics to business impact and ROI-driven decisions.",
    link: "/blog/profits-not-pixels",
    uid: "blog-6",
  },
  {
    title:
      "The Product Manager's Guide to AI Evaluations: Building Better AI Products",
    description:
      "A practical framework for product managers to evaluate and improve generative AI systems.",
    link: "/blog/product-manager-guide-ai-evaluations",
    uid: "blog-5",
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
  "Design Systems",
  "UI/UX",
] as const;
