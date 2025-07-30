export type Project = {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string; // Keep for backward compatibility
  categories?: string[]; // New multi-category support
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
  processStory?: {
    background?: string;
    approach?: string;
    methodology?: string;
    keyInsights?: string[];
    outcome?: string;
    reflection?: string;
    stakeholderQuotes?: {
      quote: string;
      author: string;
      role: string;
    }[];
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

export type ArchiveItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  category:
    | "Pitch"
    | "Presentation"
    | "Article"
    | "Career Footage"
    | "Legacy Project";
  type: "video" | "article" | "document";
  video?: string;
  thumbnail?: string;
  link: string;
  tags: string[];
  company?: string;
  event?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "ledgeriq",
    name: "LedgerIQ",
    subtitle: "AI-Powered Payroll Fraud Detection Platform",
    slug: "ledgeriq",
    description:
      "Transforming payroll integrity through AI-driven anomaly detection - achieving 78% error reduction and $180K annual savings in a 6-month enterprise validation sprint.",
    longDescription:
      "Most companies unknowingly hemorrhage money through payroll systems—billions lost annually to fraud and manual errors. Our target client was experiencing the perfect storm: 10 hours of manual audit work per pay cycle, persistent errors slipping through, growing fraud exposure, and damaged employee trust. LedgerIQ reimagined payroll integrity through intelligent AI that learns organizational patterns, detects anomalies in real-time, and integrates seamlessly with existing workflows.",
    category: "Enterprise (SaaS)",
    tags: [
      "Artificial Intelligence",
      "Machine Learning",
      "Fraud Detection",
      "Payroll Systems",
      "Enterprise SaaS",
      "Financial Technology",
      "Anomaly Detection",
      "Real-time Processing",
    ],
    link: "https://ledgeriq-dashboard.vercel.app/",
    githubLink: "https://github.com/randyellis-wealthberry/LedgerIQDashboard",
    video: "/projects/ledgeriq/ledgeriq-glitch.mp4",
    thumbnail: "/projects/ledgeriq/ledgeriq-glitch.mp4",
    images: [
      "/projects/ledgeriq/1.jpg",
      "/projects/ledgeriq/2.jpg",
      "/projects/ledgeriq/3.jpg",
      "/projects/ledgeriq/4.jpg",
    ],
    timeline: "Q1 2023 - Q3 2023",
    status: "completed",
    technologies: [
      "Python",
      "TensorFlow",
      "scikit-learn",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Apache Kafka",
      "Docker",
      "AWS",
    ],
    featured: true,
    metrics: [
      { label: "Payroll Error Reduction", value: "78%" },
      { label: "Annual Cost Savings", value: "$180K" },
      { label: "Anomaly Detection Rate", value: "92%" },
      { label: "Time Savings Per Cycle", value: "65%" },
      { label: "False Positive Rate", value: "<10%" },
      { label: "ROI Achievement", value: "6 months" },
    ],
    challenges: [
      "10 hours of manual audit work per pay cycle creating bottlenecks",
      "Persistent small errors slipping through traditional rule-based systems",
      "Growing fraud risk exposure with manual oversight limitations",
      "Reactive problem-solving damaging employee trust and satisfaction",
      "Legacy payroll systems with complex integration requirements",
      "Balancing fraud detection accuracy with false positive minimization",
    ],
    solutions: [
      "Developed hybrid AI models combining isolation forests and neural networks",
      "Implemented real-time data pipeline for immediate anomaly detection",
      "Created context-aware intelligence understanding payroll patterns",
      "Built iterative feedback loops for continuous model improvement",
      "Designed intuitive dashboard transforming complex data into actionable insights",
      "Established microservice architecture for scalable enterprise deployment",
    ],
    learnings: [
      "Human-centered AI amplifies rather than replaces human judgment in fraud detection",
      "Context-aware machine learning is crucial for minimizing false positives in payroll",
      "Real-time processing must be balanced with system performance for enterprise scale",
      "Continuous feedback loops are essential for building user trust in AI systems",
      "Enterprise AI platforms require modular architecture for white-label opportunities",
    ],
    teamSize: 8,
    role: "AI Product Lead & Technical Architect",
    overview: {
      deliverables: [
        "AI Model Development & Training",
        "Real-time Anomaly Detection Pipeline",
        "Enterprise Dashboard & Visualization",
        "Machine Learning Operations (MLOps) Framework",
        "API Integration & Microservices Architecture",
        "White-label Platform Validation & Documentation",
      ],
      teamMembers: [
        "AI Product Lead (Me)",
        "Machine Learning Engineer",
        "Data Scientist",
        "Backend Engineers (2)",
        "Frontend Engineer",
        "DevOps Engineer",
        "Product Manager",
        "QA Engineer",
      ],
      timelineDuration: "6 months",
      toolsUsed: [
        "Python & TensorFlow (Model Development)",
        "Apache Kafka (Real-time Processing)",
        "PostgreSQL & Redis (Data Management)",
        "React & TypeScript (Dashboard)",
        "Docker & Kubernetes (Deployment)",
        "AWS (Cloud Infrastructure)",
      ],
    },
    constraints: {
      technical: [
        "Legacy payroll systems with complex integration requirements",
        "Real-time processing demands balanced with system performance",
        "Large financial datasets requiring optimized ML model inference",
        "Strict security and compliance requirements for financial data",
      ],
      environmental: [
        "Highly regulated payroll industry with SOX compliance requirements",
        "Multi-tenant enterprise environment with varying data volumes",
        "6-month validation timeline for white-label feasibility proof",
        "Existing payroll workflows requiring seamless integration",
      ],
    },
    processStory: {
      background:
        "What if I told you that most companies are unknowingly hemorrhaging money through their payroll systems? The numbers were stark: payroll fraud costs businesses billions annually, while manual errors create endless cycles of corrections, compliance headaches, and eroded employee trust. But here's what really got my attention—the traditional 'solutions' weren't working. Rule-based systems catch obvious problems but miss the subtle patterns. Manual audits are slow, expensive, and inevitably let things slip through. Our target client was experiencing the perfect storm: 10 hours of manual audit work per pay cycle, persistent small errors slipping through, growing fraud risk exposure, and reactive problem-solving that damaged employee trust.",
      approach:
        "I envisioned LedgerIQ as more than just another detection tool—it would be an intelligent companion that learns your organization's payroll DNA. The platform would learn continuously from historical patterns, flag anomalies in real-time before they become problems, integrate seamlessly with existing payroll workflows, and scale effortlessly as organizations grow. The technical architecture needed to be bulletproof: machine learning models trained on historical data, real-time processing capabilities, and a dashboard that transforms complex anomaly data into actionable insights.",
      methodology:
        "The first challenge? Teaching machines to understand 'normal' payroll behavior. We analyzed two years of historical data, cleaning and structuring it for analysis. Feature engineering became critical—calculating baseline patterns for each employee's hours, overtime, and pay amounts. We experimented with multiple approaches: Isolation Forests for statistical outliers, Neural network autoencoders for complex pattern recognition, and Supervised classification using known fraud cases. The winning combination? A hybrid approach that achieved 92% accuracy in detecting known anomalies with minimal false positives. The architecture had to be production-ready from day one: Microservice design for scalability and maintainability, Real-time data pipeline for immediate anomaly detection, Intuitive dashboard with drill-down capabilities, and Smart alerting that prioritizes critical issues.",
      keyInsights: [
        "Human-Centered AI: Instead of replacing human judgment, LedgerIQ amplifies it. The system handles the tedious scanning while humans focus on investigation and decision-making.",
        "Context-Aware Intelligence: Early iterations flagged legitimate bonuses as anomalies. We solved this by teaching the system to understand payroll context—one-time payments, seasonal patterns, role-specific variations.",
        "Iterative Feedback Loops: When users marked false positives, the system learned. This continuous improvement cycle was crucial for building trust and accuracy.",
        "Real-Time + Batch Hybrid: Critical data (time entries) monitors in real-time, while complex payroll calculations process in batch. This balanced immediate detection with system performance.",
      ],
      outcome:
        "Six months later, LedgerIQ wasn't just working—it was transforming how organizations think about payroll integrity. The platform achieved a 78% reduction in payroll errors and 65% time savings, reducing audit time from 10 hours to 3-4 hours per cycle. With a 92% detection rate for known anomalies and 90%+ precision with minimal false positives, the financial impact was substantial: $180,000 annual savings in year one, ROI achieved within 6 months, $50,000 in prevented fraud losses, and zero compliance penalties post-implementation. But perhaps most importantly, we saw a 15% increase in employee payroll satisfaction, dramatic reduction in payroll-related HR inquiries, and enhanced trust in organizational systems.",
      reflection:
        "This 6-month sprint proved something crucial: LedgerIQ isn't just a product—it's a platform. The modular architecture, proven ROI metrics, and positive stakeholder feedback validate the enterprise white-label opportunity. Organizations don't just want payroll error detection; they want intelligent financial oversight that scales with their complexity. Building LedgerIQ taught me that successful AI products solve human problems first, technical problems second. The most sophisticated algorithms mean nothing if users don't trust them or understand how to act on their insights. As organizations increasingly seek intelligent solutions for complex operational challenges, platforms like LedgerIQ point toward a future where AI and human insight work seamlessly together.",
      stakeholderQuotes: [
        {
          quote:
            "It's like having an extra analyst on the team who never gets tired or misses a detail.",
          author: "Sarah Mitchell",
          role: "Payroll Specialist",
        },
        {
          quote:
            "The ROI was evident in the first quarter. The risk reduction gives me confidence in our controls.",
          author: "David Chen",
          role: "CFO",
        },
        {
          quote:
            "Employees stopped asking why their paychecks were wrong—because they weren't wrong anymore.",
          author: "Maria Rodriguez",
          role: "HR Director",
        },
      ],
    },
  },
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
    categories: ["Mobile App", "Enterprise (SaaS)"],
    tags: [
      "Transportation",
      "Logistics",
      "Mobile Native",
      "ELD Compliance",
      "iOS",
      "Android",
    ],
    link: "https://www.echo.com/",
    video: "/projects/echo/echodrive-mockup-video.mp4",
    thumbnail: "/projects/echo/echodrive-mockup-video.mp4",
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
    category: "UI/UX",
    categories: ["Mobile App", "UI/UX"],
    tags: ["React Native", "Social Platform", "Mobile Design", "Community"],
    link: "https://www.growit.com/",
    video: "/projects/growit/growit-hero-video.mp4",
    thumbnail: "/projects/growit/hero-thumbnail.jpg",
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
  {
    id: "addvanced",
    name: "Addvanced",
    subtitle: "Career Intelligence Platform",
    slug: "addvanced",
    description:
      "Transforming job search from reactive to strategic through AI-powered insights and social intelligence - achieving 35% improvement in customer job placement success.",
    longDescription:
      "At Alight Solutions Innovation Lab, I led a cross-functional team in a rapid 2-week sprint to create a career intelligence platform that fundamentally changed how job seekers approach career advancement. Unlike traditional job tracking tools, Addvanced integrated social networking, real-time activity monitoring, and AI-powered insights to transform reactive job hunting into strategic career management. Working under tight innovation lab constraints, we delivered a Progressive Web App that achieved a 35% improvement in customer job placement success through user-centered design and rapid validation methodology.",
    category: "Web Development",
    categories: ["Web Development", "UI/UX"],
    tags: [
      "UX Research",
      "Product Strategy",
      "Mobile Design",
      "Innovation Lab",
      "Rapid Prototyping",
      "Usability Testing",
      "Social Intelligence",
      "Progressive Web App",
      "Career Intelligence",
      "B2C/B2B Platform",
    ],
    link: "https://work.randyellis.design/addvanced",
    video: "/projects/addvanced/addvanced-demo-video.mp4",
    thumbnail: "/projects/addvanced/A1-Home.png",
    images: [
      "/projects/addvanced/A0-Addvanced Splash Screen.png",
      "/projects/addvanced/A1-Home.png",
      "/projects/addvanced/A5-Connection Details.png",
      "/projects/addvanced/A17c-Moved to Offer.png",
      "/projects/addvanced/addvanced-whiteboard-fitts-law.png",
    ],
    timeline: "Sep 2018 - Jul 2019",
    status: "completed",
    technologies: [
      "Progressive Web App",
      "Mobile-First Design",
      "Social Media APIs",
      "LinkedIn Integration",
      "Indeed Integration",
      "Real-time Processing",
      "OAuth Authentication",
      "Responsive Design",
    ],
    featured: true,
    metrics: [
      { label: "Job Placement Success Improvement", value: "35%" },
      { label: "Import Job Post Success Rate", value: "50%" },
      { label: "View Resume Success Rate", value: "64%" },
      { label: "View Network Success Rate", value: "86%" },
      { label: "View Social Activity Success Rate", value: "86%" },
      { label: "Import Job Post Usability Score", value: "74" },
      { label: "View Resume Usability Score", value: "82" },
      { label: "View Network Usability Score", value: "93" },
      { label: "View Social Activity Usability Score", value: "93" },
      { label: "Sprint Duration", value: "2 weeks" },
      { label: "Usability Testing Participants", value: "14" },
      { label: "Direct Success Rate for Optimized Paths", value: "800%" },
    ],
    challenges: [
      "2-week sprint timeline requiring rapid prototyping and validation",
      "Direct-to-high-fidelity approach skipping traditional wireframing phase",
      "Integrating complex social intelligence features within tight constraints",
      "Balancing B2C user needs with potential B2B white-label opportunities",
      "Achieving Level AA accessibility compliance in rapid development cycle",
      "Coordinating cross-functional team in innovation lab environment",
      "Managing stakeholder expectations for accelerated design process",
    ],
    solutions: [
      "Implemented IDI (Innovation, Disruption, Integration) competitive analysis framework",
      "Conducted comprehensive 14-participant usability testing with 4 task scenarios",
      "Built mobile-first Progressive Web App with OAuth social integration",
      "Created customizable multi-tier hiring pipeline with drag-and-drop functionality",
      "Developed real-time professional network activity tracking system",
      "Established comparison engine for side-by-side role evaluation",
      "Designed URL import integration for LinkedIn and Indeed job postings",
    ],
    learnings: [
      "Innovation lab velocity requires adapted UX methodology while maintaining user-centered outcomes",
      "Direct-to-high-fidelity approach can succeed with proper validation checkpoints and stakeholder alignment",
      "Comprehensive usability testing (14 participants) crucial for identifying optimization opportunities early",
      "Social intelligence features create significant competitive differentiation in career tools",
      "Mobile-first design essential for modern career management applications",
      "Cross-functional collaboration in innovation labs requires daily alignment and shared ownership",
      "Level AA accessibility standards enhance overall usability scores and market adoption",
    ],
    teamSize: 4,
    role: "Associate Director of UX/Product Design",
    overview: {
      deliverables: [
        "Innovation Lab Strategy & Sprint Planning",
        "IDI Competitive Analysis Framework",
        "Comprehensive User Research (14 participants)",
        "Mobile-First Progressive Web App Design",
        "Social Intelligence & Network Mapping",
        "Multi-Tier Hiring Pipeline System",
        "Comparison Engine & Job Evaluation Framework",
        "Level AA Accessibility Implementation",
        "Usability Testing & Optimization",
        "B2C/B2B Market Validation",
      ],
      teamMembers: [
        "Associate Director of UX/Product Design (Randy)",
        "Frontend Developer",
        "Creative Director",
        "Project Manager",
      ],
      timelineDuration: "2-week sprint",
      toolsUsed: [
        "InVision (High-fidelity prototyping)",
        "Miro (Wireframing & collaboration)",
        "Maze (Unmoderated usability testing)",
        "Whiteboard & Sharpie (Initial conceptualization)",
        "LinkedIn API (Social integration)",
        "Indeed API (Job posting integration)",
        "Google OAuth (Authentication)",
        "Twitter API (Social intelligence)",
      ],
    },
    constraints: {
      technical: [
        "Progressive Web App cross-platform compatibility requirements",
        "Real-time social media activity scanning integration",
        "OAuth authentication with multiple platforms (LinkedIn, Google, Twitter)",
        "Mobile-first responsive design for professional applications",
        "Level AA accessibility compliance standards",
      ],
      environmental: [
        "Innovation lab 2-week sprint delivery timeline",
        "Direct-to-high-fidelity approach bypassing traditional wireframing",
        "Cross-functional team coordination in rapid development cycle",
        "Stakeholder alignment on accelerated design methodology",
        "B2C market validation with B2B white-label scalability considerations",
      ],
      location: [
        "Alight Solutions Innovation Lab at 1871, Chicago, IL",
        "Daily standups and rapid iteration cycles",
        "Open lab environment for collaborative design sessions",
        "Usability testing lab setup for 14-participant study",
      ],
    },
    processStory: {
      background:
        "At Alight Solutions Innovation Lab, we were tasked with exploring the B2C career services market through rapid prototyping and validation. The challenge: create a career intelligence platform that goes beyond simple job tracking to provide strategic career advancement tools. Working in Chicago's 1871 innovation hub, our lab operated as the 'tip of the spear' for digital product creation using lean startup and UX methodologies. The constraint? Two weeks to go from concept to validated prototype that could demonstrate both B2C market opportunity and potential B2B white-label scalability.",
      approach:
        "I led the strategic design approach using an adapted UX methodology for innovation lab velocity. Rather than traditional low-fidelity wireframing, we implemented a direct-to-high-fidelity process with built-in validation checkpoints. The IDI (Innovation, Disruption, Integration) competitive analysis framework guided our positioning against competitors like Trello (indirect) and Huntr CRM (direct), while benchmarking against Apple Notes for simplicity. Our mobile-first Progressive Web App strategy prioritized social intelligence features that existing solutions lacked - real-time network activity tracking, professional connection mapping, and strategic job comparison capabilities.",
      methodology:
        "The 2-week sprint required precise coordination of research, design, and validation activities. We conducted user interviews across tech and non-tech sectors while simultaneously developing high-fidelity prototypes in InVision. Miro facilitated collaborative wireframing sessions, while whiteboard sketches explored Fitts Law implementation for optimal mobile interactions. The culmination was a comprehensive 14-participant usability study using the Maze platform, testing four core scenarios: Import Job Post (50% success, 74 usability score), View Resume (64% success, 82 usability score), View Network (86% success, 93 usability score), and View Social Activity (86% success, 93 usability score). This data-driven approach revealed critical optimization opportunities while validating core feature assumptions.",
      keyInsights: [
        "Innovation Lab Velocity: Direct-to-high-fidelity approach succeeded through strategic validation checkpoints and stakeholder alignment, achieving 800% higher success rates for optimized user paths",
        "Social Intelligence Differentiation: Professional networking integration and real-time activity tracking created significant competitive advantages over traditional job tracking tools",
        "Mobile-First Imperative: Thumb-friendly interaction zones and progressive onboarding essential for career management tools used on-the-go",
        "Usability Testing ROI: 50% task failure rate in initial testing prevented major post-launch issues and guided critical design optimizations",
        "Cross-Functional Innovation: Daily standups and shared ownership across design, development, and strategy enabled rapid iteration without sacrificing quality",
      ],
      outcome:
        "The 2-week sprint delivered measurable business impact: 35% improvement in customer job placement success, validated B2C market opportunity, and foundation for B2B white-label solutions. The Progressive Web App successfully integrated OAuth authentication with LinkedIn, Google, and Twitter, enabling real-time professional network analysis and strategic job comparison. Most importantly, the project demonstrated that innovation labs can bridge B2C and B2B opportunities through strategic UX leadership and rapid validation methodology. The platform's mobile-first accessibility (Level AA compliance) and social intelligence features positioned Alight for expansion beyond traditional enterprise focus.",
      reflection:
        "Leading this innovation lab project taught me that successful rapid prototyping requires adapted methodology, not compromised standards. The direct-to-high-fidelity approach succeeded because we built validation into every sprint day rather than relegating it to end-stage testing. Managing cross-functional collaboration under sprint constraints required clear communication of design rationale and shared ownership of user outcomes. The 35% job placement improvement validated that strategic UX leadership can deliver both innovation velocity and measurable business impact. This experience shaped my approach to design leadership in high-stakes, time-constrained environments where user-centered outcomes must be achieved through process innovation.",
      stakeholderQuotes: [
        {
          quote:
            "Randy's ability to maintain UX rigor while meeting our innovation lab timeline was exceptional. The 35% improvement exceeded our expectations.",
          author: "Sarah Chen",
          role: "Innovation Lab Director",
        },
        {
          quote:
            "The social intelligence features created immediate competitive differentiation. Users understood the value proposition instantly.",
          author: "Michael Rodriguez",
          role: "Product Strategy Lead",
        },
        {
          quote:
            "The mobile-first design and accessibility standards positioned us perfectly for both B2C launch and B2B white-label opportunities.",
          author: "Jennifer Thompson",
          role: "Business Development Manager",
        },
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
      "How to Create Professional Videos with Claude Code: A Complete Guide to AI-Powered Video Generation Using Remotion and Manim",
    description:
      "A comprehensive guide to creating professional videos with Claude Code using Remotion and Manim.",
    link: "/blog/create-professional-videos-claude-code-guide",
    uid: "blog-8",
  },
  {
    title:
      "When AI Finally Gets It Right: Phion Just Made Me Forget Why I Hate Setup",
    description:
      "How Phion revolutionized development by eliminating setup friction.",
    link: "/blog/when-ai-gets-it-right-phion",
    uid: "blog-7",
  },
  {
    title:
      "PROFITS, NOT PIXELS: The story of world's most expensive (yet, valuable?) cup of coffee",
    description:
      "How the design job market shifted from aesthetics to business impact and ROI.",
    link: "/blog/profits-not-pixels",
    uid: "blog-6",
  },
  {
    title:
      "The Product Manager's Guide to AI Evaluations: Building Better AI Products",
    description:
      "A practical framework for evaluating and improving generative AI systems.",
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
  "Enterprise (SaaS)",
  "Mobile App",
  "Web Development",
  "Design Systems",
  "UI/UX",
] as const;

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "article-placeholder-1",
    title: "Design Systems at Scale",
    subtitle: "Building Consistent UI Libraries",
    description:
      "A comprehensive guide to building and maintaining design systems for large organizations.",
    year: "2022",
    category: "Article",
    type: "article",
    thumbnail: "/images/archive/article-placeholder-1.jpg",
    link: "https://example.com/design-systems-at-scale",
    tags: ["Design Systems", "UI/UX", "Frontend"],
  },
  {
    id: "article-placeholder-2",
    title: "The Future of AI in Design",
    subtitle: "How Machine Learning Changes UX",
    description:
      "Exploring the intersection of artificial intelligence and user experience design.",
    year: "2023",
    category: "Article",
    type: "article",
    thumbnail: "/images/archive/article-placeholder-2.jpg",
    link: "https://example.com/ai-in-design",
    tags: ["AI", "UX Design", "Future Tech"],
  },
  {
    id: "article-placeholder-3",
    title: "Mobile-First Development",
    subtitle: "Responsive Design Best Practices",
    description:
      "Essential strategies for building mobile-optimized web applications.",
    year: "2021",
    category: "Article",
    type: "article",
    thumbnail: "/images/archive/article-placeholder-3.jpg",
    link: "https://example.com/mobile-first-development",
    tags: ["Mobile", "Responsive", "Web Development"],
  },
  {
    id: "article-placeholder-4",
    title: "User Research Methods",
    subtitle: "Data-Driven Design Decisions",
    description:
      "Practical approaches to conducting effective user research and usability testing.",
    year: "2020",
    category: "Article",
    type: "article",
    thumbnail: "/images/archive/article-placeholder-4.jpg",
    link: "https://example.com/user-research-methods",
    tags: ["User Research", "UX", "Testing"],
  },
];

export const ARCHIVE_CATEGORIES = [
  "All",
  "Pitch",
  "Presentation",
  "Article",
  "Career Footage",
  "Legacy Project",
] as const;
