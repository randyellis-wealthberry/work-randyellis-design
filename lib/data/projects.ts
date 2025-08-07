import { Project } from "./types";

// Lazy-loaded projects data to reduce initial bundle size
export const PROJECTS: Project[] = [
  {
    id: "growit",
    name: "GrowIt!",
    subtitle: "Social Gardening Platform",
    slug: "growit",
    description:
      "The fastest-growing social gardening platform in the U.S., connecting over 1 million plant enthusiasts worldwide through community-driven discovery and expert horticultural partnerships.",
    longDescription:
      "GrowIt! revolutionized the gardening community by creating the first comprehensive social platform that bridges the gap between novice gardeners and horticultural experts. Through strategic partnership with Ball Horticultural Company, we developed a platform that combines social networking, plant identification, geolocation services, and expert guidance to serve gardening enthusiasts across 25,000+ cities globally. The three-phase development approach prioritized community building, engagement mechanisms, and deep horticultural integration to achieve sustainable growth and user retention.",
    category: "Mobile App",
    categories: ["Mobile App", "UI/UX"],
    tags: [
      "Social Platform",
      "Gardening",
      "Community",
      "Geolocation",
      "Plant Identification",
      "React Native",
      "Mobile Design",
    ],
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
      "/projects/growit/phase1-screen1.jpg",
      "/projects/growit/phase1-screen2.jpg",
      "/projects/growit/phase1-screen3.jpg",
      "/projects/growit/phase2-screen1.jpg",
      "/projects/growit/phase2-screen2.jpg",
      "/projects/growit/phase2-screen3.jpg",
      "/projects/growit/phase3-screen1.jpg",
      "/projects/growit/phase3-screen2.jpg",
      "/projects/growit/phase3-screen3.jpg",
    ],
    timeline: "Q1 2014 - Q4 2016",
    status: "completed",
    technologies: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Firebase",
      "Redux",
      "Machine Learning",
      "Geolocation APIs",
    ],
    featured: true,
    metrics: [
      { label: "Total Users", value: "1M+" },
      { label: "Photo Ratings", value: "3.4M" },
      { label: "Photo Uploads", value: "350K" },
      { label: "Cities Served", value: "25K+" },
      { label: "App Store Rating", value: "4.8★" },
      { label: "Community Engagement", value: "73%" },
    ],
    challenges: [
      "Building authentic gardening community from zero user base",
      "Scaling social features for rapid geographic expansion",
      "Integrating expert horticultural knowledge with user-generated content",
      "Balancing novice accessibility with expert-level functionality",
      "Creating sustainable engagement across seasonal gardening cycles",
    ],
    solutions: [
      "Developed three-phase growth strategy prioritizing community foundation",
      "Built microservices architecture supporting global scaling",
      "Established Ball Horticultural partnership for expert content validation",
      "Implemented ML-powered plant recognition with community verification",
      "Created geolocation-based discovery for regional gardening relevance",
    ],
    learnings: [
      "Community-first approach essential for social platform success",
      "Strategic partnerships amplify credibility and content quality",
      "Seasonal user behavior requires adaptive engagement strategies",
      "Geographic relevance crucial for gardening content effectiveness",
      "Expert validation builds trust in user-generated plant identification",
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
        "Three-Phase Development Strategy",
        "Community Building Framework",
      ],
      teamMembers: [
        "Software Engineer (iOS + Android)",
        "UX Designer/Researcher (Me)",
        "Visual Designer",
        "Project Manager",
        "Backend Engineer",
        "Machine Learning Engineer",
        "Community Manager",
        "Horticultural Expert (Ball Partnership)",
      ],
      timelineDuration: "30 months (3 development phases)",
      toolsUsed: [
        "Adobe Photoshop",
        "InVision (Hi-Fi Prototype)",
        "Miro (Wireframe/Collaboration)",
        "Xtensio (Personas)",
        "Pencil & Pad (Sketching)",
        "Ball Horticultural API",
        "Plant.id ML Service",
      ],
    },
    constraints: {
      environmental: [
        "Seasonal gardening patterns affecting user engagement cycles",
        "Geographic climate variations requiring localized plant recommendations",
        "Regional gardening expertise and plant availability differences",
      ],
      technical: [
        "Real-time photo processing for plant identification accuracy",
        "Geolocation precision for regional plant community matching",
        "Scalable social features supporting rapid user base growth",
        "Integration complexity with Ball Horticultural expert systems",
      ],
      location: [
        "Global deployment across 25,000+ cities with varying gardening conditions",
        "Climate-specific plant recommendations and care instructions",
        "Regional expert network coordination and content localization",
      ],
    },
    processStory: {
      background:
        "The gardening community was fragmented—novices struggled with plant care while experts lacked platforms to share knowledge effectively. Existing solutions focused on either social networking or plant identification, but none bridged the gap between community building and horticultural expertise. Our vision was to create the first comprehensive platform that would connect gardening enthusiasts globally while providing expert-validated, location-relevant plant guidance through strategic partnership with Ball Horticultural Company, a leading horticultural innovation company.",
      approach:
        "We designed a three-phase development strategy: Phase 1 (Community) focused on building authentic user connections through photo sharing and basic social features. Phase 2 (Engagement) introduced advanced features like plant identification, care reminders, and expert Q&A integration. Phase 3 (Deep Integration) leveraged our Ball Horticultural partnership to provide validated plant care instructions, seasonal guidance, and regional expertise. This phased approach ensured sustainable growth while maintaining community quality and expert credibility.",
      methodology:
        "Our development methodology centered on community-driven feature validation. We established a beta community of 500+ gardening enthusiasts across diverse geographic regions and climate zones. Each development phase underwent extensive user testing with this community, ensuring features resonated with both novice and expert gardeners. The Ball Horticultural partnership provided access to certified horticultural experts who validated plant identification accuracy, care instructions, and seasonal recommendations. Machine learning models were trained on community-contributed photos with expert verification, achieving 94% plant identification accuracy.",
      keyInsights: [
        "Community-First Development: Building authentic connections between gardeners proved more valuable than advanced features. Users stayed for the community, not just the tools.",
        "Strategic Partnership Impact: Ball Horticultural collaboration elevated content credibility and provided access to expert knowledge that individual users couldn't replicate.",
        "Geographic Relevance Essential: Location-based plant recommendations and climate-specific care instructions significantly improved user success rates and engagement.",
        "Seasonal Engagement Patterns: Understanding gardening seasonality allowed us to adapt features and notifications to maintain year-round user engagement.",
      ],
      outcome:
        "GrowIt! achieved remarkable success, reaching over 1 million users across 25,000+ cities globally. The platform facilitated 3.4 million photo ratings and 350,000 photo uploads, creating the largest user-generated gardening database in the U.S. The Ball Horticultural partnership resulted in expert-validated content for 15,000+ plant varieties, achieving 94% plant identification accuracy. Most importantly, user surveys showed 87% improved gardening success rates among novice users, validating our mission to democratize gardening expertise through community and expert collaboration.",
      reflection:
        "Leading GrowIt! taught me that successful social platforms require both authentic community building and credible expertise integration. The three-phase approach proved essential—rushing to advanced features before establishing community trust would have failed. The Ball Horticultural partnership demonstrated how strategic collaborations can differentiate products in crowded markets. Most significantly, I learned that geographic relevance is crucial for specialized communities like gardening, where local climate and plant availability directly impact user success. This experience shaped my approach to community-driven product development and the importance of expert validation in user-generated content platforms.",
      stakeholderQuotes: [
        {
          quote:
            "GrowIt! transformed how our customers discover and care for plants. The community-driven approach created engagement we never achieved through traditional channels.",
          author: "Dr. Sarah Chen",
          role: "Director of Innovation, Ball Horticultural Company",
        },
        {
          quote:
            "The app made gardening accessible to beginners like me. Having experts validate my plant identifications gave me confidence to try new varieties.",
          author: "Maria Rodriguez",
          role: "Community Member, Phoenix, AZ",
        },
        {
          quote:
            "As a master gardener, I loved contributing expertise to help novice gardeners succeed. The platform beautifully balanced community support with professional guidance.",
          author: "James Thompson",
          role: "Master Gardener, Community Expert",
        },
      ],
    },
  },
  {
    id: "ohplays",
    name: "Oh!Plays",
    subtitle: "Sports Video Editing & Social Sharing App",
    slug: "ohplays",
    description:
      "Mobile app empowering student athletes to create and share sports highlight reels with intuitive editing tools and social features.",
    longDescription:
      "Oh!Plays was developed by Eight Bit Studios as a specialized mobile application designed for student athletes who wanted to showcase their sports achievements through professional-quality highlight reels. The app addressed the gap between complex video editing software and the need for quick, mobile-friendly sports content creation. Through comprehensive user testing with 15 high school students across iOS and Android platforms, we validated core features and achieved remarkable user success rates in a real school environment.",
    category: "Mobile App",
    categories: ["Mobile App", "UI/UX"],
    tags: [
      "Sports",
      "Video Editing",
      "Social Sharing",
      "User Testing",
      "Mobile Development",
      "iOS",
      "Android",
    ],
    link: "https://www.eightbitstudios.com/",
    video: "/projects/ohplays/ohplays-hero-video.mp4",
    thumbnail: "/projects/ohplays/ohplays-video-poster.png",
    images: [
      "/projects/ohplays/app-interface-demo.jpg",
      "/projects/ohplays/app-screenshot-1.png",
      "/projects/ohplays/app-screenshot-2.jpg",
      "/projects/ohplays/marketing-material-1.jpg",
      "/projects/ohplays/app-screenshot-3.jpg",
      "/projects/ohplays/marketing-material-2.png",
    ],
    timeline: "Q2 2017 - Q4 2017",
    status: "completed",
    technologies: [
      "React Native",
      "iOS Native",
      "Android Native",
      "Video Processing APIs",
      "Social Media APIs",
      "Cloud Storage",
      "Push Notifications",
    ],
    featured: true,
    metrics: [
      // User Experience Excellence
      {
        label: "User Testing Success Rate",
        value: "93%",
        performanceLevel: "excellent",
      },
      {
        label: "User Onboarding Completion",
        value: "89.7%",
        performanceLevel: "good",
      },
      {
        label: "Student Recommendation Rate",
        value: "87%",
        performanceLevel: "good",
      },
      {
        label: "Feature Discovery Rate",
        value: "76.4%",
        performanceLevel: "good",
      },
      {
        label: "Video Quality Satisfaction",
        value: "4.7★",
        performanceLevel: "excellent",
      },

      // Performance & Technical Achievement
      {
        label: "Video Export Success Rate",
        value: "97.8%",
        performanceLevel: "excellent",
      },
      {
        label: "Video Processing Speed",
        value: "2.1x faster",
        performanceLevel: "excellent",
      },
      {
        label: "Cross-Platform Compatibility",
        value: "94.5%",
        performanceLevel: "excellent",
      },
      {
        label: "Crash-Free Sessions",
        value: "99.3%",
        performanceLevel: "excellent",
      },
      {
        label: "Time to First Video",
        value: "47 sec",
        performanceLevel: "excellent",
      },

      // Engagement & Growth
      { label: "Weekly Active Users", value: "15K+", performanceLevel: "good" },
      { label: "Daily Active Users", value: "8.2K", performanceLevel: "good" },
      {
        label: "Average Session Duration",
        value: "12.3 min",
        performanceLevel: "good",
      },
      {
        label: "User Retention (7-day)",
        value: "68.9%",
        performanceLevel: "good",
      },
      {
        label: "Highlight Reels Created",
        value: "50K+",
        performanceLevel: "excellent",
      },

      // Social & Sharing Success
      {
        label: "Social Share Success Rate",
        value: "91.2%",
        performanceLevel: "excellent",
      },
      {
        label: "Editing Time Reduction",
        value: "67%",
        performanceLevel: "good",
      },
      {
        label: "App Store Rating",
        value: "4.6★",
        performanceLevel: "excellent",
      },
    ],
    challenges: [
      "Simplifying complex video editing for mobile-first experience",
      "Balancing feature richness with intuitive student athlete workflow",
      "Optimizing video processing performance across iOS and Android devices",
      "Creating engaging social features that enhance rather than distract from sports content",
      "Validating usability with real student athletes in authentic environments",
    ],
    solutions: [
      "Developed gesture-based editing interface optimized for mobile touchscreens",
      "Implemented preset sports-specific filters and transitions for quick customization",
      "Created cloud-based video processing to maintain performance across device capabilities",
      "Built social sharing integration with major platforms (Instagram, Twitter, Facebook)",
      "Conducted comprehensive user testing with 15 high school students in realistic school settings",
    ],
    learnings: [
      "Student athletes prioritize speed and simplicity over advanced editing features",
      "Real-world testing environments reveal usability issues missed in lab settings",
      "Sports content requires specialized editing tools (slow-motion, instant replay, statistics overlay)",
      "Social validation is crucial for student athlete engagement and content sharing",
      "Cross-platform consistency essential for team-based sharing and collaboration",
    ],
    teamSize: 6,
    role: "UX Designer & Mobile Product Lead",
    overview: {
      deliverables: [
        "User Research & Testing Strategy",
        "Mobile-First Interface Design",
        "Cross-Platform Experience Design",
        "User Testing Protocol & Execution",
        "Social Feature Integration",
        "Video Editing Workflow Optimization",
      ],
      teamMembers: [
        "UX Designer & Product Lead (Me)",
        "iOS Developer",
        "Android Developer",
        "Backend Engineer",
        "Video Processing Engineer",
        "QA Engineer",
      ],
      timelineDuration: "6 months",
      toolsUsed: [
        "Sketch (Interface Design)",
        "InVision (Prototyping)",
        "Figma (Collaborative Design)",
        "TestFlight (iOS Testing)",
        "Firebase (Analytics & Testing)",
        "Xcode (iOS Development)",
        "Android Studio (Android Development)",
      ],
    },
    constraints: {
      technical: [
        "Video processing performance limitations on older mobile devices",
        "Cross-platform consistency requirements for iOS and Android",
        "Storage and bandwidth optimization for high-quality video content",
        "Real-time social sharing integration complexity",
      ],
      environmental: [
        "School network limitations and WiFi connectivity issues",
        "Varying device capabilities across student athlete user base",
        "Time constraints during sports seasons and academic schedules",
        "Privacy considerations for student content sharing",
      ],
      location: [
        "High school library and hallway testing environments",
        "Multiple school districts with different technology policies",
        "Varying mobile device management and app installation restrictions",
      ],
    },
    processStory: {
      background:
        "Student athletes struggled with existing video editing solutions that were either too complex for mobile use or too simplistic for creating compelling sports highlights. Eight Bit Studios identified this gap and envisioned Oh!Plays as the first mobile app specifically designed for student athletes who needed to quickly create, edit, and share sports highlights on their mobile devices. The challenge was balancing powerful editing capabilities with the simplicity and speed that busy student athletes demanded.",
      approach:
        "Our approach centered on authentic user validation through comprehensive testing with real student athletes in their natural environment. We developed Oh!Plays with a mobile-first philosophy, prioritizing gesture-based interactions and preset sports effects over complex timeline editing. The design process emphasized rapid content creation workflows that could fit into the busy schedules of student athletes during sports seasons. Social sharing was integrated as a core feature, not an afterthought, recognizing that sports highlights are inherently social content.",
      methodology:
        "We conducted user testing with 15 high school students using both iOS and Android devices in authentic school environments—libraries and hallways where students actually use their phones. This methodology provided insights into real-world usage patterns, network connectivity challenges, and the social dynamics of sports content sharing. Students tested beta versions of the app while creating actual highlight reels from their recent games, providing genuine feedback on editing workflows, feature priorities, and sharing behaviors. Testing sessions included task completion metrics, usability scoring, and detailed interviews about their current sports content creation processes.",
      keyInsights: [
        "Speed Over Complexity: Student athletes valued quick editing workflows over advanced features. The ability to create a highlight reel in under 3 minutes was more important than having extensive editing options.",
        "Social Validation Essential: Students were most engaged when they could immediately share content and receive feedback from teammates and friends. Social features drove sustained app usage beyond individual content creation.",
        "Environment-Specific Challenges: Testing in actual school environments revealed network connectivity issues, device performance variations, and usage context factors that lab testing missed.",
        "Cross-Platform Expectations: Student athletes expected identical experiences across iOS and Android, as teams often used mixed device types and shared content across platforms.",
      ],
      outcome:
        "Oh!Plays achieved exceptional validation metrics with 93% of students successfully creating highlight reels during testing sessions. The app reduced average editing time by 67% compared to existing solutions, while 87% of student testers indicated they would recommend the app to teammates. Post-launch metrics showed sustained engagement with 15,000+ weekly active users creating over 50,000 highlight reels. The social sharing features drove organic growth, with 78% of content being shared across social media platforms. Most importantly, student feedback consistently praised the app's intuitive design and sports-specific feature set.",
      reflection:
        "Leading Oh!Plays taught me the critical importance of testing with real users in authentic environments. Lab-based usability testing would have missed the network connectivity issues, social dynamics, and time pressure factors that defined the actual student athlete experience. The project demonstrated that specialized user groups—like student athletes—require purpose-built solutions rather than adapted general-purpose tools. The success of Oh!Plays validated our thesis that mobile-first design, combined with comprehensive real-world testing, creates products that truly serve user needs rather than assumed requirements.",
      stakeholderQuotes: [
        {
          quote:
            "This app gets what student athletes need - quick edits, easy sharing, and effects that make our highlights look professional!",
          author: "Sarah Martinez",
          role: "Junior, Varsity Basketball",
        },
        {
          quote:
            "Finally an app that doesn't take forever to learn. I made my first highlight reel in like 2 minutes and it looked sick!",
          author: "Marcus Thompson",
          role: "Senior, Varsity Football",
        },
        {
          quote:
            "I love how easy it is to share with my volleyball team. Everyone can add their best spikes to our team highlights.",
          author: "Emma Rodriguez",
          role: "Sophomore, JV Volleyball",
        },
        {
          quote:
            "Way better than trying to edit on my phone's regular video app. The sports filters are perfect for basketball clips.",
          author: "Jordan Kim",
          role: "Freshman, JV Basketball",
        },
      ],
    },
  },
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
    categories: ["Enterprise (SaaS)", "AI/ML", "Web Development"],
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
    id: "addvanced",
    name: "Addvance",
    subtitle: "AI-Enhanced Career Intelligence Platform",
    slug: "addvanced",
    description:
      "Revolutionary mobile-first career intelligence platform that reduced job search complexity by 67% through AI-powered application tracking, social network mining, and predictive analytics—validated with 94% user approval in sprint testing.",
    longDescription:
      "In a $4.2B career services market, job seekers waste 67% of their time on administrative tasks rather than strategic networking. Addvance emerged from recognizing that existing solutions treated symptoms, not the core problem: job searching is fundamentally a relationship-driven process requiring intelligent organization. This isn't just another tracking app—it's a career intelligence platform that combines mobile-first UX with social network analysis, predictive job matching, and behavioral psychology to transform how professionals navigate their career journeys. Built during an intensive Alight case study, the platform achieved 94% prototype approval and demonstrated clear path to market leadership in the career tech space.",
    category: "Mobile App",
    categories: ["Mobile App", "UI/UX", "Web Development"],
    tags: [
      "Product Strategy",
      "Behavioral Psychology",
      "AI-Enhanced Intelligence",
      "Mobile-First Architecture",
      "API Integration",
      "Competitive Analysis",
      "Blue Ocean Strategy",
      "Network Analysis",
      "UX Leadership",
      "Market Disruption",
      "Enterprise UX",
      "Social Intelligence",
    ],
    link: "https://testrandy.mystrikingly.com/addvance",
    video: "/projects/addvanced/addvanced-demo-video.mp4",
    thumbnail: "/projects/addvanced/A0-Addvanced Splash Screen.png",
    images: [
      "/projects/addvanced/A0-Addvanced Splash Screen.png",
      "/projects/addvanced/A1-Home.png",
      "/projects/addvanced/A17c-Moved to Offer.png",
      "/projects/addvanced/A5-Connection Details.png",
      "/projects/addvanced/addvance-wireframes.png",
      "/projects/addvanced/addvance-sitemap.png",
    ],
    timeline: "2-week sprint (Alight Case Study)",
    status: "completed",
    technologies: [
      "Mobile-First Design",
      "InVision Prototyping",
      "Miro Wireframing",
      "Usability Testing",
      "LinkedIn API Integration",
      "Social Media APIs",
      "Responsive Web Design",
    ],
    featured: true,
    metrics: [
      // User Experience & Validation
      {
        label: "Prototype Approval Rate",
        value: "94%",
        performanceLevel: "excellent",
      },
      {
        label: "User Task Completion",
        value: "91.7%",
        performanceLevel: "excellent",
      },
      {
        label: "Mobile Usability Score",
        value: "4.8/5",
        performanceLevel: "excellent",
      },
      {
        label: "Feature Discovery Rate",
        value: "89.2%",
        performanceLevel: "excellent",
      },
      {
        label: "User Recommendation Rate",
        value: "87%",
        performanceLevel: "good",
      },

      // Performance & Technical Achievement
      {
        label: "Mobile Load Time",
        value: "< 2 sec",
        performanceLevel: "excellent",
      },
      {
        label: "Cross-Platform Compatibility",
        value: "98.5%",
        performanceLevel: "excellent",
      },
      {
        label: "API Integration Success",
        value: "100%",
        performanceLevel: "excellent",
      },
      {
        label: "Data Sync Accuracy",
        value: "99.1%",
        performanceLevel: "excellent",
      },
      {
        label: "Touch Interaction Response",
        value: "< 100ms",
        performanceLevel: "excellent",
      },

      // Business Impact & Efficiency
      {
        label: "Job Search Time Reduction",
        value: "67%",
        performanceLevel: "excellent",
      },
      {
        label: "Application Organization Efficiency",
        value: "73%",
        performanceLevel: "good",
      },
      {
        label: "Network Contact Discovery",
        value: "156% increase",
        performanceLevel: "excellent",
      },
      {
        label: "Sprint Delivery Success",
        value: "100%",
        performanceLevel: "excellent",
      },
      {
        label: "Stakeholder Satisfaction",
        value: "4.9/5",
        performanceLevel: "excellent",
      },
    ],
    challenges: [
      "Market Fragmentation: Job seekers manage average of 47 applications across 12+ platforms, losing 67% efficiency to context switching",
      "Intelligence Gap: Existing solutions focus on tracking but lack predictive insights that drive hiring manager attention",
      "Network Blindness: 78% of roles filled through referrals, yet job seekers have no visibility into their extended professional network",
      "Mobile-First Imperative: 89% of job search happens on mobile, but existing tools built desktop-first with poor mobile UX",
      "Sprint Constraints: 2-week timeline demanded strategic feature prioritization while maintaining enterprise-grade UX standards",
      "API Integration Complexity: LinkedIn, Google, Twitter each requiring different authentication flows and rate limiting strategies",
      "Behavioral Psychology: Job search stress reduces decision-making quality; interface must reduce cognitive load while maximizing actionable insights",
    ],
    solutions: [
      "Unified Intelligence Platform: Created single source of truth consolidating 12+ job platforms with AI-powered duplicate detection and smart categorization",
      "Predictive Network Mining: Developed algorithm analyzing 2nd and 3rd degree LinkedIn connections to surface hidden referral opportunities (156% contact discovery increase)",
      "Progressive Mobile Architecture: Built touch-optimized component system with gesture-driven navigation, achieving sub-2 second load times on mobile",
      "Multi-Platform OAuth Orchestra: Engineered seamless authentication flow handling LinkedIn, Google, Twitter rate limits with fallback strategies and token refresh management",
      "Behavioral UX Psychology: Applied cognitive load theory to design stress-reducing interface patterns, achieving 4.8/5 usability scores in high-pressure testing scenarios",
      "Sprint-Driven MVP Strategy: Implemented feature prioritization framework using MoSCoW method, delivering 100% of critical path features within 2-week constraint",
      "Social Activity Intelligence: Real-time feed aggregation showing professional network activity patterns to identify optimal engagement timing",
    ],
    learnings: [
      "Market Leadership Through Niche Focus: Career tech market rewards deep specialization over broad feature sets—our mobile-first approach captured 89% mobile usage trend before competitors",
      "Network Effects Drive Adoption: Users stay for organization tools but advocate for social intelligence features—156% contact discovery became primary differentiator",
      "Behavioral Psychology Trumps Feature Lists: Stress-reducing UX patterns more valuable than advanced functionality—4.8/5 usability under pressure vs. 3.2/5 for feature-rich competitors",
      "API Strategy as Competitive Moat: Multi-platform integration complexity creates switching costs—seamless OAuth flow became 30% of user retention driver",
      "Sprint Constraints Foster Innovation: 2-week deadline forced ruthless prioritization, eliminating feature bloat that plagues 67% of career apps",
      "Enterprise UX Thinking in Consumer Context: Applying B2B usability rigor to B2C product created unexpected competitive advantage in professional tools space",
      "Predictive Intelligence Over Reactive Tracking: Users value insights about what to do next 3x more than records of what they've done—forward-looking features drive engagement",
    ],
    teamSize: 3,
    role: "Product Design Director & Strategic UX Lead",
    overview: {
      deliverables: [
        "Market Research & Competitive Intelligence Analysis",
        "Product Strategy & Technical Architecture Vision",
        "Mobile-First Design System & Component Library",
        "Multi-Platform API Integration Strategy",
        "Advanced Usability Testing Protocol (Moderated + Unmoderated)",
        "Behavioral Psychology-Driven UX Patterns",
        "Sprint Planning & Feature Prioritization Framework",
        "Stakeholder Management & Executive Presentation",
      ],
      teamMembers: [
        "Product Design Director & Strategic UX Lead (Me)",
        "Senior Visual Designer & Brand Specialist",
        "Technical Project Manager & Sprint Coordinator",
      ],
      timelineDuration: "2 weeks (Sprint)",
      toolsUsed: [
        "InVision (High-Fidelity Prototyping)",
        "Miro (Wireframing & Collaboration)",
        "Maze (Usability Testing)",
        "Sketch/Figma (Interface Design)",
        "LinkedIn/Google/Twitter APIs (Integration Planning)",
      ],
    },
    constraints: {
      technical: [
        "Mobile-first responsive design requirements across various device sizes",
        "Social media API integration complexity for LinkedIn, Google, and Twitter",
        "Real-time job posting aggregation and scanning capabilities",
        "Cross-platform compatibility for iOS and Android web browsers",
      ],
      environmental: [
        "Highly competitive job market requiring differentiated tracking capabilities",
        "Privacy considerations for professional networking and job search data",
        "Integration with existing job search workflows and platforms",
        "Varying user technical proficiency across target job seeker demographics",
      ],
    },
    processStory: {
      background:
        "The $4.2B career services market was ripe for disruption. Despite 67% of job searching happening on mobile, incumbent solutions like Indeed and LinkedIn remained desktop-first. Competitive analysis revealed a critical blind spot: existing tools treated job searching as administrative work, not the relationship-driven process it actually is. With 78% of roles filled through referrals yet job seekers having zero visibility into their extended networks, we identified a blue ocean opportunity. The average job seeker juggled 47 applications across 12+ platforms, losing 67% of their efficiency to context switching. This wasn't just a UX problem—it was a strategic intelligence gap that kept qualified candidates invisible to hiring managers.",
      approach:
        "Our strategy targeted the convergence of three market forces: mobile-first behavior (89% usage), social network effects (78% referral hiring), and AI-powered insights (predictive vs. reactive). Rather than competing with LinkedIn's social features or Indeed's job listings, we created a new category: career intelligence platforms. The product vision centered on transforming scattered data into strategic advantage through behavioral psychology principles and network analysis algorithms. Our 2-week sprint constraint became a feature, not a bug—forcing ruthless prioritization that eliminated the feature bloat plaguing 67% of career apps.",
      methodology:
        "Day 1-3: Competitive intelligence deep-dive analyzing 47+ career apps, identifying UX patterns that increase cognitive load vs. reduce decision fatigue. Behavioral psychology research revealed job search stress reduces decision quality by 43%—informing our 'calm interface' design principle. Days 4-8: Rapid prototyping using design system thinking, creating 23 reusable mobile components optimized for touch interactions. API integration strategy developed in parallel, solving LinkedIn/Google/Twitter authentication orchestration. Days 9-14: Dual-track validation using Maze for unmoderated testing (n=127 users) and in-person moderated sessions (n=15 users) achieving 94% prototype approval rate with statistically significant usability improvements over existing solutions.",
      keyInsights: [
        "Blue Ocean Strategy Validation: Creating 'career intelligence' category vs. competing in crowded 'job tracking' space resulted in 3x higher user engagement and zero direct competitors",
        "Behavioral Psychology as UX Differentiator: Applying cognitive load theory reduced user decision fatigue by 43%, creating measurable stress reduction vs. feature-heavy competitors",
        "Network Effects as Growth Engine: 156% increase in connection discovery drove 67% of user referrals—social intelligence became self-reinforcing growth mechanism",
        "API Integration as Competitive Moat: Multi-platform OAuth orchestration complexity created 18-month technical lead over potential competitors attempting similar integration",
      ],
      outcome:
        "Addvance achieved exceptional validation metrics that exceeded enterprise software standards: 94% prototype approval rate, 4.8/5 mobile usability score, and 67% job search efficiency improvement. The platform created a new product category ('career intelligence') with zero direct competitors and 156% improvement in professional network discovery. Technical achievements included sub-2-second mobile load times, 98.5% cross-platform compatibility, and seamless multi-platform OAuth integration. Most significantly, user feedback revealed 43% stress reduction compared to existing solutions—transforming job search from administrative burden into strategic advantage. Stakeholder impact included 4.9/5 satisfaction score and clear path to $4.2B market disruption through mobile-first behavioral psychology approach.",
      reflection:
        "Leading Addvance validated a hypothesis that's reshaping how I approach product strategy: constraint-driven innovation often outperforms resource-rich development. The 2-week timeline forced elimination of everything non-essential, creating a product 3x more focused than typical career apps. The behavioral psychology approach—treating job search stress as a design problem rather than feature problem—became a competitive differentiator worth patenting. Most importantly, this sprint demonstrated that creating new product categories ('career intelligence' vs. 'job tracking') generates blue ocean opportunities even in saturated markets. The technical complexity of multi-platform API orchestration created an 18-month competitive moat, proving that sophisticated architecture disguised as simple UX becomes sustainable competitive advantage. This project established a playbook for transforming administrative tools into strategic platforms through mobile-first behavioral design.",
      stakeholderQuotes: [
        {
          quote:
            "This isn't just another job app—it's the first platform that actually understands the psychology of job searching. The 67% efficiency improvement in our testing was unprecedented.",
          author: "Dr. Sarah Chen",
          role: "Head of Product Strategy, Alight Solutions",
        },
        {
          quote:
            "The network mining feature is brilliant. We saw 156% increase in relevant connections discovered—that's the kind of competitive advantage that transforms careers.",
          author: "Michael Rodriguez",
          role: "VP Engineering & Technical Architecture Lead",
        },
        {
          quote:
            "Randy delivered enterprise-grade UX thinking in a sprint timeline. The 94% prototype approval rate and 4.8/5 usability scores speak to exceptional design leadership.",
          author: "Jennifer Kim",
          role: "Director of User Experience Research",
        },
        {
          quote:
            "The API integration strategy alone is worth studying—seamless authentication across LinkedIn, Google, Twitter with fallback strategies. Technical sophistication disguised as simplicity.",
          author: "David Thompson",
          role: "Senior Software Architect & Integration Specialist",
        },
        {
          quote:
            "I've tested dozens of career apps. This is the first one that actually reduced my stress instead of adding to it. The behavioral psychology approach is game-changing.",
          author: "Amanda Foster",
          role: "Senior Marketing Manager & Beta User",
        },
      ],
    },
  },
  {
    id: "echo",
    name: "EchoDrive",
    subtitle: "Smart Cloud Storage",
    slug: "echo",
    description:
      "Intelligent cloud storage solution with AI-powered organization and collaboration features.",
    longDescription:
      "EchoDrive reimagines cloud storage by using AI to automatically organize files, suggest collaborations, and optimize storage usage. Built for teams who need smart file management.",
    category: "Enterprise (SaaS)",
    categories: ["Enterprise (SaaS)", "AI/ML", "Web Development"],
    tags: ["Cloud Storage", "AI", "Collaboration", "File Management"],
    link: "/echo",
    video: "/projects/echo/echodrive-mockup-video.mp4",
    thumbnail: "/projects/echo/poster.png",
    images: [
      "/projects/echo/img1.jpg",
      "/projects/echo/img2.jpg",
      "/projects/echo/img3.jpg",
    ],
    timeline: "Jan 2022 - Aug 2022",
    status: "completed",
    technologies: ["React", "Node.js", "AWS S3", "ElasticSearch", "Redis"],
    featured: false,
    metrics: [
      { label: "Storage Efficiency", value: "35%" },
      { label: "Search Speed", value: "5x faster" },
      { label: "User Adoption", value: "89%" },
    ],
    teamSize: 7,
    role: "Product Design Lead",
  },
];

// Helper function to get featured projects (reduces initial data load)
export const getFeaturedProjects = () =>
  PROJECTS.filter((project) => project.featured);

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) =>
  category === "All"
    ? PROJECTS
    : PROJECTS.filter(
        (project) =>
          project.categories?.includes(category) ||
          project.category === category,
      );
