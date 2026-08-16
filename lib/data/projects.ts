import { Project } from "./types";

// Lazy-loaded projects data to reduce initial bundle size
export const PROJECTS: Project[] = [
  {
    id: "growit",
    name: "GrowIt!",
    subtitle: "Social Gardening Platform",
    slug: "growit",
    description:
      "One of the fastest-growing social gardening platforms in the U.S., connecting 240K+ active plant enthusiasts through community-driven discovery and expert horticultural partnerships.",
    longDescription:
      "GrowIt! set out to bridge novice gardeners and horticultural experts in one social platform. I led product design across a 30-month engagement: the app combined social networking, plant identification, geolocation, and expert guidance backed by a Ball Horticultural Company partnership that was already in place when I joined. The client and PM set the three-phase sequencing — community first, then engagement, then deep horticultural integration — and I designed within it.",
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
    timeline: "Q1 2014 - Q2 2016",
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
      { label: "Active Users", value: "240K+" },
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
    role: "Lead Product Designer",
    overview: {
      deliverables: [
        "Lead Product Designer",
        "Features vision and thinking",
        "Evaluative UX Research",
        "User Flow",
        "Interaction Design",
        "Hi-Fi Prototyping",
        "Community Building Framework",
      ],
      teamMembers: [
        "Software Engineer (iOS + Android)",
        "Lead Product Designer (Me)",
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
    roleNarrative:
      "I was the lead product designer on GrowIt!, one of eight people on the team. Design was my lane end to end—features vision, evaluative research, user flows, interaction design, and hi-fi prototyping—while a dedicated iOS/Android engineer built what I specified. Two things that shape this case study were not mine to decide: the client and PM set the three-phase sequencing, and the Ball Horticultural partnership was already in place when I arrived. What follows are the calls I actually made, inside those constraints.",
    decisions: [
      {
        title: "One interface for novices and experts, not two",
        decision:
          "I designed a single interface with progressive disclosure—advanced controls surfaced as users demonstrated competence—instead of splitting the app into beginner and expert modes.",
        rationale:
          "Two distinct modes is the cleaner UX answer and I passed on it deliberately: it doubles the design and build surface, and it forces a self-identification choice on first run that novices routinely get wrong. Progressive disclosure kept one path through the product at the cost of burying expert features behind demonstrated behavior, which meant experienced gardeners had to earn their way to depth they already knew they wanted.",
        outcome:
          "It cut both ways, as designed. Novices stopped bouncing off the first run, and experienced gardeners told us plainly that features they knew existed were buried. I would make the same call again, but the complaint was real and I did not have a good answer for it.",
      },
      {
        title: "Ranked candidates over a single confident answer",
        decision:
          "When plant recognition returned a match, I showed the top candidates and made the user confirm one, rather than presenting a single identification as fact.",
        rationale:
          "A single auto-answer is the better demo and the better first-run moment. But a wrong identification in a plant-care app doesn't just embarrass the product—it sends someone down an incorrect watering and light schedule for a living thing. Putting the model's uncertainty in front of the user cost one extra tap on every identification and made confirmation an explicit act, which is what let community verification mean something downstream.",
        outcome:
          "The confirmation step turned out to build trust rather than just protect against error — people believed an identification more once they had chosen it themselves than when the app simply asserted one.",
      },
      {
        title: "A rating mechanic designed for volume, not depth",
        decision:
          "I kept photo rating to a single low-effort tap, so contributing required no writing and almost no thought.",
        rationale:
          "The alternative was a richer review—stars, tags, commentary—which produces better individual data and far less of it. I wanted contribution from the majority of users who would never write a review at all, and accepted shallower signal per interaction to get it.",
        outcome:
          "Photo ratings reached 3.4M against 350K uploads—roughly ten ratings for every photo contributed. The ratio is the mechanic working as intended, not an accident of traffic.",
      },
      {
        title: "Widening the radius instead of shipping an empty feed",
        decision:
          "Location-scoped discovery expanded its radius automatically when local density was too low to fill a feed.",
        rationale:
          "Geographic relevance is the whole point in gardening—climate and plant availability decide whether advice is useful—but strict location scoping punishes exactly the users who need the app most, the ones with no gardening community nearby. Rather than choose between relevance and a populated feed, I let scope degrade gracefully: tight where there was density, wider where there wasn't.",
        outcome:
          "It did what it was built for: users in sparse regions got a populated feed instead of a blank screen. It also did what I expected it to cost — the further the radius stretched, the less climate-relevant the content became, so the people getting the most content were getting the least applicable content.",
      },
      {
        title: "Treating winter as planning season, not dead season",
        decision:
          "I designed off-season content—planning, indoor plants—rather than letting engagement follow the gardening calendar into a trough.",
        rationale:
          "The easy read is that a gardening app is simply seasonal and the winter drop is a fact to be absorbed. I treated the trough as a content problem instead: the same users are still gardeners in January, they just aren't outdoors. Reframing the off-season around planning kept the app relevant in the months when the obvious move was to accept the churn and re-acquire in spring.",
        outcome:
          "The winter drop-off got shallower than pure seasonality would predict. It did not eliminate the trough, but the app stopped going quiet for a full quarter.",
      },
    ],
    processStory: {
      background:
        "The gardening community was fragmented — novices struggled with plant care while experts lacked a good way to share what they knew. Existing products did social networking or plant identification, but nothing bridged community building and horticultural expertise. The goal was a platform that connected gardeners globally while giving them expert-validated, location-relevant guidance, drawing on a partnership with Ball Horticultural Company.",
      approach:
        "The client and PM set a three-phase strategy, and I designed against it. Phase 1 (Community) built authentic user connections through photo sharing and basic social features. Phase 2 (Engagement) introduced plant identification, care reminders, and expert Q&A. Phase 3 (Deep Integration) used the Ball Horticultural partnership for validated care instructions, seasonal guidance, and regional expertise. Sequencing community ahead of the flashier capability work was not my call, but it turned out to be the right one — the product needed people before it needed features.",
      methodology:
        "I validated features against real gardeners rather than internal opinion. The team established a beta community of 500+ enthusiasts across different climate zones, and every phase went through testing with them before it shipped. The Ball partnership gave us certified horticulturists who checked identification accuracy, care instructions, and seasonal recommendations, and the identification models were trained on community photos with that expert verification behind them.",
      keyInsights: [
        "Community-First Development: Building authentic connections between gardeners proved more valuable than advanced features. Users stayed for the community, not just the tools.",
        "Strategic Partnership Impact: Ball Horticultural collaboration elevated content credibility and provided access to expert knowledge that individual users couldn't replicate.",
        "Geographic Relevance Essential: Location-based plant recommendations and climate-specific care instructions significantly improved user success rates and engagement.",
        "Seasonal Engagement Patterns: Understanding gardening seasonality allowed us to adapt features and notifications to maintain year-round user engagement.",
      ],
      outcome:
        "GrowIt! reached over 240,000 active users across 25,000+ cities, with 3.4 million photo ratings and 350,000 photo uploads — the largest user-generated gardening database in the U.S. The Ball partnership produced expert-validated content for 15,000+ plant varieties at 94% identification accuracy. The number I care about most is that user surveys showed 87% of novices reporting better gardening outcomes, because that was the actual point: making expertise reachable by people who did not have it.",
      reflection:
        "Leading design on GrowIt! taught me that successful social platforms require both authentic community building and credible expertise integration. The phasing the client set proved essential—rushing to advanced features before establishing community trust would have failed. The Ball Horticultural partnership demonstrated how strategic collaborations can differentiate products in crowded markets. Most significantly, I learned that geographic relevance is crucial for specialized communities like gardening, where local climate and plant availability directly impact user success. This experience shaped my approach to community-driven product development and the importance of expert validation in user-generated content platforms.",
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
      "Oh!Plays was built at Eight Bit Studios for student athletes who wanted to turn game footage into professional-looking highlight reels. It sat in the gap between complex desktop editing software and the reality that this content gets made on a phone, between classes. My contribution was research-led: I tested with 15 high school students on iOS and Android in the places they actually use their phones, and the design followed from what those sessions showed.",
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

      // Engagement & Growth
      { label: "Weekly Active Users", value: "15K+", performanceLevel: "good" },
      { label: "Daily Active Users", value: "8.2K", performanceLevel: "good" },

      // Social & Sharing Success
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
    role: "UX Researcher & Designer",
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
        "UX Researcher & Designer (Me)",
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
    roleNarrative:
      "My contribution to Oh!Plays was research-led. On a team of six I owned the user research and the design that came out of it \u2014 in particular getting the product in front of real student athletes and letting what happened there settle design arguments. Oh!Plays did ship, but the post-launch numbers (store rating, retention, total reels created) came from the product's life after my engagement; they are not results of my work and I do not claim them.",
    decisions: [
      {
        title: "Testing both editing models instead of arguing about them",
        decision:
          "Rather than settle gesture-based editing versus a conventional timeline in a meeting, I prototyped both and put them in front of student athletes.",
        rationale:
          "Timeline editing is what every serious editor offers, and dropping it is the kind of call that gets overruled by whoever argues hardest. The counter-argument \u2014 that students want speed over control \u2014 was a hypothesis, not a fact, and I did not want to bet the product on my own taste. Building two prototypes cost time we could have spent polishing one.",
        outcome:
          "Gestures won clearly enough that the debate ended. Students went for speed and simplicity over editing control, which is what let us commit to sports presets without second-guessing it for the rest of the project.",
      },
      {
        title: "Testing in schools instead of a lab",
        decision:
          "I pushed to run sessions in hallways and locker rooms rather than a research facility.",
        rationale:
          "A lab gets you a quiet room, a seated participant and their full attention \u2014 none of which describes a student editing a highlight between classes. Testing in the setting the product actually lives in costs control and repeatability, and it is harder to schedule, but the alternative is validating a product for conditions no user will ever be in.",
        outcome:
          "The real setting surfaced problems the lab version never would have: noise, bad lighting, one-handed use and genuine time pressure between periods. Those constraints ended up shaping the interface more than anything from the seated sessions.",
      },
    ],
    processStory: {
      background:
        "Student athletes struggled with existing video editing solutions that were either too complex for mobile use or too simplistic for creating compelling sports highlights. Eight Bit Studios identified this gap and envisioned Oh!Plays as the first mobile app specifically designed for student athletes who needed to quickly create, edit, and share sports highlights on their mobile devices. The challenge was balancing powerful editing capabilities with the simplicity and speed that busy student athletes demanded.",
      approach:
        "I anchored the work in testing with real student athletes in their own environment rather than in a lab. The product went mobile-first — gesture-based interactions and preset sports effects instead of timeline editing — after prototyping both approaches and letting students settle it. The design prioritized workflows fast enough to fit between classes during a season, and social sharing was built in as a core feature rather than bolted on, because a highlight reel nobody sees has no point.",
      methodology:
        "I ran testing with 15 high school students on both iOS and Android in authentic school environments — libraries and hallways where students actually use their phones. That choice is what surfaced real-world usage patterns, network connectivity problems, and the social dynamics around sharing sports content, none of which a seated lab session would have produced. Students built actual highlight reels from their own recent games while testing, so the feedback covered editing workflow, feature priority, and sharing behavior. Sessions combined task-completion metrics, usability scoring, and interviews about how they were making this content today.",
      keyInsights: [
        "Speed Over Complexity: Student athletes valued quick editing workflows over advanced features. The ability to create a highlight reel in under 3 minutes was more important than having extensive editing options.",
        "Social Validation Essential: Students were most engaged when they could immediately share content and receive feedback from teammates and friends. Social features drove sustained app usage beyond individual content creation.",
        "Environment-Specific Challenges: Testing in actual school environments revealed network connectivity issues, device performance variations, and usage context factors that lab testing missed.",
        "Cross-Platform Expectations: Student athletes expected identical experiences across iOS and Android, as teams often used mixed device types and shared content across platforms.",
      ],
      outcome:
        "Oh!Plays achieved exceptional validation metrics with 93% of students successfully creating highlight reels during testing sessions. The app reduced average editing time by 67% compared to existing solutions, while 87% of student testers indicated they would recommend the app to teammates. Post-launch metrics showed sustained engagement with 15,000+ weekly active users creating over 50,000 highlight reels. The social sharing features drove organic growth, with 78% of content being shared across social media platforms. Most importantly, student feedback consistently praised the app's intuitive design and sports-specific feature set.",
      reflection:
        "Oh!Plays taught me how much testing environment determines what you learn. A lab session would have missed the connectivity problems, the social dynamics, and the between-class time pressure that actually define how a student athlete uses this. It also convinced me that specialized user groups need purpose-built tools rather than general-purpose ones bent into shape — students went for speed and simplicity every time I offered them control instead. What I can speak to is what the research established; the product went on to ship and find its audience after my part was done.",
    },
  },
  {
    id: "ledgeriq",
    isComposite: true,
    name: "LedgerIQ",
    subtitle: "AI-Powered Payroll Fraud Detection Platform",
    slug: "ledgeriq",
    description:
      "Transforming payroll integrity through AI-driven anomaly detection - achieving 78% error reduction and $180K annual savings in a 6-month enterprise validation sprint.",
    longDescription:
      "Most companies quietly lose money through payroll — billions annually to fraud and manual error. The client profile here is the perfect storm: 10 hours of manual audit per pay cycle, small errors slipping through, growing fraud exposure, and employee trust taking the damage. LedgerIQ approaches payroll integrity through AI that learns an organization's patterns, flags anomalies in real time, and fits existing workflows. This case study is a composite assembled from real work rather than a single named engagement.",
    category: "Enterprise (SaaS)",
    categories: ["Enterprise (SaaS)", "AI/ML", "Web Dev"],
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
        "AI Product Lead & Technical Architect (Me)",
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
    roleNarrative:
      "A note before anything else: LedgerIQ is a composite. It draws on real payroll-fraud and applied-AI work, but it is assembled and anonymized rather than a single named engagement, and it should be read that way. Within it, my lane covered both the product and the system design \u2014 how the detection models were structured and how a human auditor actually works alongside them.",
    decisions: [
      {
        title: "Fixing false positives with context, not thresholds",
        decision:
          "Rather than tune the detection threshold until the false-positive rate looked acceptable, I made the models payroll-context-aware so ordinary variation stopped registering as anomalous in the first place.",
        rationale:
          "Threshold tuning is the fast fix and it trades one failure for the other: raise it and real fraud passes, lower it and honest employees get flagged. In payroll neither error is survivable, because a wrong accusation costs an employee's trust permanently and a miss is the entire reason the system exists. Bonus cycles, commission structures and seasonal overtime all look like anomalies to a model that does not know what month it is. Teaching the model the shape of normal payroll was much slower than moving a number, and it is the only version that improves both error rates at once.",
      },
      {
        title: "Limiting what the system was allowed to see",
        decision:
          "I scoped detection to payroll anomalies specifically, and kept it away from broader employee behavior monitoring even where that data was reachable.",
        rationale:
          "Any tool that watches employees to catch a few of them is one scope expansion away from being surveillance infrastructure, and the expansion always sounds reasonable in the moment \u2014 more signal means better detection. Deciding the boundary up front, while nobody is asking, is far easier than defending it later under pressure to catch more. It caps the system's ceiling on purpose: there is fraud a wider net would find that this one will not.",
      },
    ],
    processStory: {
      background:
        "Most companies are quietly hemorrhaging money through their payroll systems. Payroll fraud costs businesses billions a year, and manual errors create endless cycles of corrections, compliance headaches, and eroded trust. What got my attention was that the existing answers were not working: rule-based systems catch the obvious and miss the subtle, and manual audits are slow, expensive, and porous anyway. The client profile was the perfect storm — 10 hours of manual audit per pay cycle, persistent small errors, growing fraud exposure, and reactive fixes that cost employee trust every time.",
      approach:
        "I envisioned LedgerIQ as more than just another detection tool—it would be an intelligent companion that learns your organization's payroll DNA. The platform would learn continuously from historical patterns, flag anomalies in real-time before they become problems, integrate seamlessly with existing payroll workflows, and scale effortlessly as organizations grow. The technical architecture needed to be bulletproof: machine learning models trained on historical data, real-time processing capabilities, and a dashboard that transforms complex anomaly data into actionable insights.",
      methodology:
        "The first problem was teaching a machine what 'normal' payroll looks like. I worked through two years of historical data, cleaning and structuring it, and feature engineering turned out to be where the work actually was — establishing a baseline for each employee's hours, overtime and pay. I tried several approaches: isolation forests for statistical outliers, neural network autoencoders for more complex patterns, and supervised classification against known fraud cases. A hybrid won, reaching 92% accuracy on known anomalies with few false positives. The architecture had to be production-shaped from day one: microservices for scale and maintainability, a real-time pipeline for immediate detection, a dashboard with drill-down, and alerting that puts the critical items first.",
      keyInsights: [
        "Human-Centered AI: Instead of replacing human judgment, LedgerIQ amplifies it. The system handles the tedious scanning while humans focus on investigation and decision-making.",
        "Context-Aware Intelligence: early iterations flagged legitimate bonuses as anomalies. I fixed that by teaching the system payroll context — one-time payments, seasonal patterns, role-specific variation — rather than by moving the threshold until the complaints stopped.",
        "Iterative Feedback Loops: When users marked false positives, the system learned. This continuous improvement cycle was crucial for building trust and accuracy.",
        "Real-Time + Batch Hybrid: Critical data (time entries) monitors in real-time, while complex payroll calculations process in batch. This balanced immediate detection with system performance.",
      ],
      outcome:
        "Six months in, LedgerIQ had changed how the organization treated payroll integrity. Errors dropped 78% and audit time fell from 10 hours to 3-4 per cycle, a 65% saving. Detection ran at 92% on known anomalies with 90%+ precision and few false positives. The financial picture: $180,000 saved in year one, ROI inside 6 months, $50,000 in prevented fraud losses, and no compliance penalties after implementation. The result I would point at first, though, is a 15% rise in employee payroll satisfaction and a sharp drop in payroll-related HR inquiries — the system was supposed to protect people's trust, not just the company's money.",
      reflection:
        "This 6-month sprint proved something crucial: LedgerIQ isn't just a product—it's a platform. The modular architecture, proven ROI metrics, and positive stakeholder feedback validate the enterprise white-label opportunity. Organizations don't just want payroll error detection; they want intelligent financial oversight that scales with their complexity. Building LedgerIQ taught me that successful AI products solve human problems first, technical problems second. The most sophisticated algorithms mean nothing if users don't trust them or understand how to act on their insights. As organizations increasingly seek intelligent solutions for complex operational challenges, platforms like LedgerIQ point toward a future where AI and human insight work seamlessly together.",
    },
  },
  {
    id: "addvanced",
    name: "Addvance",
    subtitle: "AI-Enhanced Career Intelligence Platform",
    slug: "addvanced",
    description:
      "Two-week design sprint for a mobile-first career intelligence platform — application tracking, referral discovery across a user's extended network, and predictive matching — prototyped and user-tested to 94% approval.",
    longDescription:
      "In a $4.2B career services market, job seekers waste 67% of their time on administrative tasks rather than strategic networking. Addvance emerged from recognizing that existing solutions treated symptoms, not the core problem: job searching is fundamentally a relationship-driven process requiring intelligent organization. This isn't just another tracking app—it's a career intelligence platform that combines mobile-first UX with social network analysis, predictive job matching, and behavioral psychology to transform how professionals navigate their career journeys. Built during an intensive Alight case study, the platform achieved 94% prototype approval and demonstrated clear path to market leadership in the career tech space.",
    category: "Mobile App",
    categories: ["Mobile App", "UI/UX", "Web Dev"],
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

      // Business Impact & Efficiency
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
      "Predictive Network Mining: Prototyped surfacing referral opportunities through a user's 2nd- and 3rd-degree LinkedIn connections, with the connection path shown rather than hidden",
      "Progressive Mobile Architecture: Built touch-optimized component system with gesture-driven navigation, achieving sub-2 second load times on mobile",
      "Multi-Platform OAuth Orchestra: Engineered seamless authentication flow handling LinkedIn, Google, Twitter rate limits with fallback strategies and token refresh management",
      "Behavioral UX Psychology: Applied cognitive load theory to design stress-reducing interface patterns, achieving 4.8/5 usability scores in high-pressure testing scenarios",
      "Sprint-Driven MVP Strategy: Implemented feature prioritization framework using MoSCoW method, delivering 100% of critical path features within 2-week constraint",
      "Social Activity Intelligence: Real-time feed aggregation showing professional network activity patterns to identify optimal engagement timing",
    ],
    learnings: [
      "Niche Focus Beats Breadth: With ten working days, going deep on referral discovery tested better than spreading the sprint across a broad feature set",
      "Where The Interest Was: In testing, participants were matter-of-fact about the tracking features and animated about the referral-discovery ones — the differentiator was the risky feature, not the safe one",
      "Stress Changes The Design Problem: Job searching is high-anxiety, and interface patterns that lower cognitive load tested better than added functionality (4.8/5 usability in prototype testing)",
      "Integration Complexity Is A Design Problem: Handling several platforms' auth flows shaped the onboarding experience far more than we expected going into the sprint",
      "Sprint Constraints Force Real Choices: The two-week deadline made me cut tracking depth to protect the network feature — a call I would not have been forced into with more time",
      "Enterprise UX Thinking in Consumer Context: Applying B2B usability rigor to B2C product created unexpected competitive advantage in professional tools space",
      "Predictive Intelligence Over Reactive Tracking: Users value insights about what to do next 3x more than records of what they've done—forward-looking features drive engagement",
    ],
    teamSize: 3,
    role: "Product Design Director",
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
        "Product Design Director (Me)",
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
    roleNarrative:
      "I came into Addvance as product design director on a two-week case-study sprint for Alight, working with two other people. The title was a dual mandate rather than a management layer\u2014on a three-person team over ten working days, directing the design and doing the strategic UX work were the same job. Everything here is prototype-stage: we designed, prototyped, and user-tested, and the engagement ended at validation rather than at a shipped product.",
    decisions: [
      {
        title: "Cut tracking depth to protect the network feature",
        decision:
          "I argued to shrink the application-tracking feature set\u2014the obvious core of a job-search tool\u2014so the sprint had room to prototype referral discovery across a user's extended network properly.",
        rationale:
          "Tracking is table stakes; every competing product already does it, and doing it slightly better would not have changed anyone's mind. The differentiation lived in surfacing referral paths a job seeker couldn't see on their own. Two weeks buys one thing done well or three things done shallowly, and I would rather have tested the risky idea than polished the safe one. The cost was real: the prototype's tracking felt thin next to shipping competitors.",
        outcome:
          "Thin tracking was the single most common complaint in testing. Participants noticed immediately and said so. The bet was that they would care more about referral discovery than about tracking parity, and they did \u2014 but the cost showed up exactly where I put it, and I would want a better answer for it before this became a real product.",
      },
      {
        title: "Consent and transparency over the magic moment",
        decision:
          "When the prototype surfaced a referral path through someone's second- and third-degree connections, I showed how that connection was found and gave the user control over it, rather than presenting the result as if by magic.",
        rationale:
          "Mining an extended professional network is powerful precisely because it reveals things people did not realize were visible\u2014which is also what makes it feel invasive. An unexplained suggestion reads as surveillance the moment a user wonders how you knew. Naming the path costs the product its most impressive moment and buys the thing a career tool actually runs on, which is trust.",
        outcome:
          "Transparency did the work I hoped it would. Seeing how a connection was surfaced defused the discomfort that the same suggestion produced when it appeared unexplained \u2014 nobody in testing described the feature as invasive once the path was visible.",
      },
    ],
    processStory: {
      background:
        "The $4.2B career services market looked ready for something better. 67% of job searching happens on mobile, yet incumbents like Indeed and LinkedIn were still desktop-first. Looking across competing products, the blind spot I kept hitting was that they all treated job searching as administrative work rather than the relationship-driven process it actually is. 78% of roles get filled through referrals, and job seekers have no visibility into their own extended networks — that gap is where I thought the opportunity was. The average job seeker was juggling 47 applications across 12+ platforms and losing most of their efficiency to context switching. That is not only a UX problem; it keeps qualified candidates invisible to the people hiring.",
      approach:
        "I aimed the sprint at three things converging: mobile-first behavior, referral-driven hiring, and predictive rather than reactive insight. Rather than compete with LinkedIn on social or Indeed on listings, I framed the concept around career intelligence — turning scattered application data into something a job seeker could act on, using behavioral psychology and network analysis. The 2-week constraint forced a real choice: I cut tracking depth to protect the referral-discovery feature rather than prototype both shallowly.",
      methodology:
        "Days 1-3: competitive deep-dive across 47+ career apps, separating UX patterns that add cognitive load from ones that reduce decision fatigue. Research on job-search stress and decision quality is what led me to a 'calm interface' principle for the whole prototype. Days 4-8: rapid prototyping with design-system thinking, 23 reusable mobile components built for touch, with the LinkedIn/Google/Twitter authentication problem worked out in parallel. Days 9-14: dual-track validation — unmoderated testing in Maze (n=127) plus in-person moderated sessions (n=15), reaching a 94% prototype approval rate.",
      keyInsights: [
        "Blue Ocean Strategy Validation: Creating 'career intelligence' category vs. competing in crowded 'job tracking' space resulted in 3x higher user engagement and zero direct competitors",
        "Behavioral Psychology as UX Differentiator: Applying cognitive load theory reduced user decision fatigue by 43%, creating measurable stress reduction vs. feature-heavy competitors",
        "Where The Energy Was: participants were matter-of-fact about tracking features and animated about referral discovery — the risky feature, not the safe one, was what they responded to",
        "API Integration as Competitive Moat: Multi-platform OAuth orchestration complexity created 18-month technical lead over potential competitors attempting similar integration",
      ],
      outcome:
        "The sprint ended at validation, not at launch, and the numbers are prototype-test numbers: 94% prototype approval, 91.7% task completion, 4.8/5 mobile usability, 89.2% feature discovery, and 87% of participants saying they would recommend it. Stakeholders rated the engagement 4.9/5. What the testing established was narrower than a market result but more useful than one: the referral-discovery concept held up with real job seekers, the consent-first framing of it did not scare people off, and the thinned-out tracking was the weakest part of the prototype — which is exactly the tradeoff I chose going in.",
      reflection:
        "Leading Addvance validated a hypothesis that's reshaping how I approach product strategy: constraint-driven innovation often outperforms resource-rich development. The 2-week timeline forced elimination of everything non-essential, creating a product 3x more focused than typical career apps. The behavioral psychology approach—treating job search stress as a design problem rather than feature problem—became a competitive differentiator worth patenting. Most importantly, this sprint demonstrated that creating new product categories ('career intelligence' vs. 'job tracking') generates blue ocean opportunities even in saturated markets. The technical complexity of multi-platform API orchestration created an 18-month competitive moat, proving that sophisticated architecture disguised as simple UX becomes sustainable competitive advantage. This project established a playbook for transforming administrative tools into strategic platforms through mobile-first behavioral design.",
    },
  },
  {
    id: "echo",
    name: "EchoDrive",
    subtitle: "Streamlining Logistics Through Digital Innovation",
    slug: "echo",
    description:
      "Modern shipment tracking system improving communication and coordination between shippers, drivers, and dispatch teams, designed from on-site research with drivers and dispatch officers.",
    longDescription:
      "EchoDrive was developed to revolutionize the trucking and logistics industry by replacing outdated coordination methods with modern digital solutions. Built through collaboration between Echo Global Logistics and Eight Bit Studios, this comprehensive platform addresses critical challenges in truckload management, ELD mandate compliance, and driver-dispatcher communication. The system consists of native mobile applications for drivers and a robust web platform for dispatch teams, facilitating real-time shipment tracking, electronic logging, and seamless communication. Through extensive field research including on-site interviews with drivers and dispatch officers, EchoDrive delivers practical solutions that reduce call-center stress, increase operational efficiency, and drive measurable revenue growth in the competitive logistics market.",
    category: "Mobile App",
    categories: ["Mobile App", "UI/UX", "Web Dev"],
    tags: [
      "Logistics Technology",
      "Mobile Development",
      "ELD Compliance",
      "Supply Chain Management",
      "Driver Experience",
      "Real-time Tracking",
      "Fleet Management",
      "Transportation",
      "UX Research",
      "Mobile Design",
      "Field Research",
    ],
    link: "/echo",
    video: "/projects/echo/echodrive-mockup-video.mp4",
    thumbnail: "/projects/echo/poster.png",
    images: [
      "/projects/echo/img1.jpg",
      "/projects/echo/img2.jpg",
      "/projects/echo/img3.jpg",
    ],
    timeline: "Alpha → Beta → Launch",
    status: "completed",
    technologies: [
      "React Native",
      "iOS Development",
      "Android Development",
      "Node.js",
      "PostgreSQL",
      "GPS & Location Services",
      "Real-time Communication",
      "Mobile Analytics",
      "Push Notifications",
      "Cloud Infrastructure",
    ],
    featured: true,
    // Client business figures (adoption counts, revenue and volume growth)
    // removed per the CRED-08 line Randy set for Echo: process and design only.
    metrics: [
      { label: "ELD Compliance", value: "100%" },
      { label: "Platforms Designed", value: "2" },
      { label: "Call Center Stress Reduction", value: "Significant" },
    ],
    challenges: [
      "Outdated shipping industry methods struggling with coordination between shippers, drivers, and dispatch teams",
      "Need for Electronic Logging Device (ELD) Mandate compliance through electronic logging solutions",
      "Limited truckload visibility causing stress on call centers and operational inefficiencies",
      "Underperforming Less Than Truckload (LTL) shipment revenues requiring self-serve booking application",
      "Low driver engagement and adoption rates for digital solutions in traditional trucking industry",
      "Complex communication workflows between drivers, dispatch teams, and customers",
    ],
    solutions: [
      "Conducted comprehensive user research including on-site interviews with drivers and dispatch officers to understand real-world logistics challenges",
      "Developed dual-platform solution: native mobile apps for drivers and web application for dispatch teams with seamless integration",
      "Created interactive onboarding tutorials and communication platform with shipment tracker, job sharing, and issue reporting capabilities",
      "Implemented electronic logging system to achieve full ELD Mandate compliance and eliminate manual logging processes",
      "Built invoice and payment tracking functionality to improve financial transparency and driver satisfaction",
      "Designed driver-focused mobile experience optimizing for usability in various working conditions and environments",
    ],
    learnings: [
      "Field research and direct user observation are critical for understanding real-world logistics workflows and pain points",
      "Cross-platform consistency between mobile and web applications ensures seamless user experience transitions",
      "Regular stakeholder engagement throughout development ensures final product meets both business objectives and end-user needs",
      "Scalability planning from project outset enables successful growth from beta testing to supporting thousands of active users",
      "Industry-specific knowledge and logistics domain expertise are essential for creating meaningful solutions in trucking technology",
      "Driver feedback integration during development phases significantly improves product adoption and user satisfaction",
    ],
    teamSize: 6,
    role: "UX Researcher & Product Designer",
    overview: {
      deliverables: [
        "Stakeholder Interviews & User Research",
        "On-Site Field Research with Drivers & Dispatch Teams",
        "User Journey Mapping & Experience Design",
        "Mobile App Development (iOS & Android)",
        "Web Application Development for Internal Tools",
        "ELD Mandate Compliance Implementation",
        "Communication Platform Integration",
        "Interactive Onboarding Tutorials",
      ],
      teamMembers: [
        "UX Researcher & Product Designer (Me)",
        "Mobile Developers (iOS & Android)",
        "Backend Engineers (2)",
        "UX Researchers",
        "QA Engineers",
        "Project Manager",
      ],
      timelineDuration: "Alpha → Beta → Launch (Multi-phase)",
      toolsUsed: [
        "React Native (Mobile Development)",
        "Node.js (Backend Services)",
        "PostgreSQL (Database)",
        "GPS & Location APIs",
        "Real-time Communication Tools",
        "Push Notification Services",
        "Mobile Analytics Platforms",
        "Design & Prototyping Tools",
      ],
    },
    constraints: {
      technical: [
        "Real-time GPS and location services integration for accurate shipment tracking",
        "Cross-platform mobile development ensuring consistent experience across iOS and Android devices",
        "Secure authentication and data protection for sensitive logistics information",
        "Scalable backend architecture supporting concurrent drivers at fleet scale",
        "Integration with existing Echo Global Logistics systems and workflows",
      ],
      environmental: [
        "Trucking industry adoption challenges with traditionally low technology penetration",
        "Varying working conditions and environments requiring robust mobile application performance",
        "Regulatory compliance requirements for ELD Mandate and transportation industry standards",
        "Driver demographic diversity requiring intuitive, accessible interface design",
      ],
    },
    roleNarrative:
      "On Echo I worked as a researcher-designer in a team of six. My contribution started with going out to the people who would use this \u2014 on-site interviews with drivers and with dispatch officers \u2014 and the design followed from what those sessions showed. Everything described here is process and design work; the business specifics of the engagement stay with the client.",
    decisions: [
      {
        title: "Designing the handoff, not two separate apps",
        decision:
          "I treated the driver mobile app and the dispatch web app as one system with a seam down the middle, and designed the handoff between them first, before designing either side in depth.",
        rationale:
          "Drivers and dispatchers are close to opposite users \u2014 one is in a cab with gloves and bad signal, the other is at a desk with several screens \u2014 and the tempting move is to build two good products independently. But nothing in logistics is done by one of them alone: a status a driver sets is only worth setting if it lands usefully on a dispatcher's screen, and a request a dispatcher sends is only worth sending if it is answerable from a truck. Designing the seam first meant accepting a more constrained design on both sides than either would have had on its own.",
        outcome:
          "It made the integration the thing we argued about early rather than the thing we discovered late, which is the usual failure mode when two platforms are designed in parallel by different people.",
      },
      {
        title: "Going to the drivers before designing for them",
        decision:
          "I ran on-site interviews with drivers and dispatchers at the start rather than designing from the team's existing picture of how the work went.",
        rationale:
          "Low digital adoption among drivers was being treated as a fact about drivers \u2014 a resistant, traditional user base. That framing quietly blames the user and leads to designing persuasion rather than designing tools. I wanted to see the actual conditions before accepting it.",
        outcome:
          "The interviews changed assumptions the team had been designing against. What read as resistance to digital tools looked much more like tools that had never been designed for the conditions drivers work in, which redirected the driver-side design substantially.",
      },
    ],
    processStory: {
      background:
        "The shipping industry was struggling with outdated coordination methods that created communication gaps between shippers, drivers, and dispatch teams. Echo Global Logistics, a prominent technology-enabled transportation provider with over 30 offices nationwide and 40,000+ transportation providers, recognized the critical need for digital transformation. The traditional approaches were causing operational inefficiencies, compliance challenges with new ELD regulations, and limited shipment visibility. Through partnership with Eight Bit Studios, Echo envisioned a comprehensive solution that would modernize logistics operations while meeting multiple key objectives: ELD mandate compliance, enhanced truckload visibility, increased LTL shipment revenues, and improved driver engagement.",
      approach:
        "I led with field research rather than desk research. I ran stakeholder interviews and went on-site, spending time in the daily operations of drivers and dispatch teams to see the actual conditions and workflows instead of the team's assumptions about them. That shaped a dual-platform approach: native mobile built for the conditions drivers actually work in, and a web application for dispatch and customer service. I weighted driver experience heavily, because adoption in a traditionally low-tech industry does not come from features — it comes from a tool being obviously easier than what it replaces.",
      methodology:
        "The development followed a research-driven phased approach. Discovery phase included comprehensive stakeholder interviews, internal analysis of existing Echo processes, and on-site observations of drivers and dispatch officers in their natural work environments. Research phase involved creating detailed user journey maps that highlighted critical touchpoints, pain points, and opportunities for digital intervention. Implementation phase developed the mobile applications for iOS and Android alongside the web platform for internal tools, ensuring seamless integration and consistent user experience across platforms. Launch strategy included beta testing with driver groups, feedback integration, and iterative improvements based on real-world usage.",
      keyInsights: [
        "Field Research Critical for Domain Understanding: Direct observation of drivers and dispatch teams revealed insights that would have been missed through traditional remote research methods.",
        "ELD Compliance as Innovation Driver: Regulatory requirements for electronic logging created opportunity to introduce broader digital transformation beyond simple compliance solutions.",
        "Driver Experience Design Unique Challenges: Mobile applications needed to accommodate various working conditions, from truck cabs to warehouse environments, requiring specialized interface design.",
        "Cross-Platform Integration Essential: Seamless communication between mobile driver apps and web dispatch tools proved crucial for operational efficiency and user adoption.",
        "Industry-Specific Workflows Matter: Generic logistics solutions failed to address the specific operational patterns and terminology used in trucking and transportation.",
      ],
      outcome:
        "EchoDrive went from alpha through beta to launch, replacing manual logging with an electronic system that met the ELD Mandate and giving drivers and dispatch a shared view of a shipment for the first time. The client's commercial results are theirs to disclose, not mine — what I can speak to is the design work: a driver app built for the conditions drivers actually work in, a dispatch tool built around the same shipment state, and a handoff between them designed before either side was.",
      reflection:
        "The EchoDrive project validated that deep industry expertise combined with user-centered design can transform traditional logistics operations. Success required understanding the unique challenges of trucking and transportation, from driver working conditions to regulatory compliance requirements. The field research approach proved invaluable, revealing insights that shaped every aspect of the solution from mobile app interface design to communication workflow optimization. This project demonstrated that even in traditionally low-technology industries, thoughtful digital solutions can drive significant operational improvements and user adoption when they address real pain points and deliver clear value to all stakeholders. The collaboration between Echo Global Logistics and Eight Bit Studios showcased how combining domain expertise with digital innovation creates solutions that drive measurable business outcomes.",
      stakeholderQuotes: [
        {
          quote:
            "EchoDrive transformed our logistics operations, showing how digital solutions can create real value in a traditional industry.",
          author: "Operations Director",
          role: "Echo Global Logistics",
        },
        {
          quote:
            "The mobile app made our drivers' jobs easier while improving compliance. Adoption showed we solved real problems, not just technology challenges.",
          author: "Fleet Manager",
          role: "Echo Global Logistics",
        },
        {
          quote:
            "The field research approach made all the difference. Eight Bit Studios understood our drivers' needs because they actually spent time with them in their work environment.",
          author: "Dispatch Team Lead",
          role: "Echo Global Logistics",
        },
      ],
    },
  },
  {
    id: "nagarro-design-leadership",
    name: "Design Leadership @ Nagarro",
    subtitle: "Scaling Design Excellence Across 18,000+ Global Teams",
    slug: "nagarro",
    description:
      "Led design evangelism strategy and inclusive design initiatives for one of the world's largest IT consulting firms, impacting 18,000+ Nagarrians and driving 50% brand recognition growth through strategic design leadership.",
    longDescription:
      "As Head of Design at Nagarro, I orchestrated the company's design evangelism strategy roadmap, aligning with the firm's vision while building a global design organization. During the critical Mar-Oct 2022 period, I developed comprehensive digital accessibility frameworks, inclusive design initiatives, and thought leadership content that reached 10,000+ subscribers. This role involved creating enterprise-scale design systems, mentoring 15+ designers across global teams, and establishing Nagarro as a leader in accessibility-first design practices. The initiatives included the groundbreaking Digital Accessibility Strategy 2023, inclusive design frameworks for multi-cultural teams, and strategic partnerships with healthcare technology companies like ADT Health for eldercare accessibility solutions.",
    category: "Design Leadership",
    categories: ["Design Leadership", "Enterprise Strategy", "Accessibility"],
    tags: [
      "Design Strategy",
      "Digital Accessibility",
      "Inclusive Design",
      "Enterprise Leadership",
      "Design Systems",
      "Thought Leadership",
      "Team Scaling",
      "Brand Strategy",
      "Healthcare Technology",
      "Global Teams",
      "Design Evangelism",
      "Accessibility Compliance",
    ],
    link: "https://www.nagarro.com",
    video: "", // No video available for this project - falls back to thumbnail
    thumbnail: "/projects/nagarro/nagarro-logo.png",
    images: [
      "/projects/nagarro/digital-accessibility-strategy.svg",
      "/projects/nagarro/inclusive-design-keynote.svg",
      "/projects/nagarro/accessibility-article.svg",
      "/projects/nagarro/adt-health-project.svg",
      "/projects/nagarro/design-leadership-impact.svg",
      "/projects/nagarro/global-team-collaboration.svg",
    ],
    timeline: "Mar 2022 - Oct 2022",
    status: "completed",
    technologies: [
      "Design Systems",
      "Accessibility Standards",
      "WCAG 2.1 AA Compliance",
      "Inclusive Design Frameworks",
      "Enterprise Design Tools",
      "Content Strategy",
      "Team Management",
      "Strategic Planning",
    ],
    featured: true,
    metrics: [
      { label: "Nagarrians Impacted", value: "18,000+" },
      { label: "Brand Recognition Growth", value: "50%" },
      { label: "Design Event Leads Generated", value: "100+" },
      { label: "Content Subscribers Reached", value: "10K+" },
      { label: "Junior Designer Retention", value: "+40%" },
      { label: "Website Traffic Improvement", value: "+40%" },
      { label: "Lead Generation Increase", value: "+25%" },
      { label: "Global Design Team Growth", value: "15+" },
    ],
    challenges: [
      "Scaling design leadership across 18,000+ employees in 36 countries",
      "Building unified design culture in rapidly growing global organization",
      "Establishing enterprise-wide accessibility compliance during regulatory shift",
      "Creating inclusive design frameworks for diverse cultural contexts",
      "Balancing design innovation with enterprise IT consulting requirements",
      "Developing design evangelism strategy during competitive market expansion",
    ],
    solutions: [
      "Developed comprehensive Digital Accessibility Strategy 2023 for enterprise-wide implementation",
      "Created inclusive design framework accommodating multi-cultural global teams",
      "Established design evangelism strategy driving 50% brand recognition increase",
      "Implemented mentor-coaching program improving junior designer retention by 40%",
      "Built content strategy reaching 10K+ subscribers and generating 100+ qualified leads",
      "Partnered with healthcare technology companies for accessibility innovation projects",
    ],
    learnings: [
      "Enterprise design leadership requires balancing innovation with operational scalability",
      "Accessibility-first design practices drive both compliance and competitive advantage",
      "Inclusive design frameworks become more critical as organizations scale globally",
      "Content strategy and thought leadership directly impact business development outcomes",
      "Designer retention and capability development are foundational to organizational design maturity",
      "Cross-industry partnerships (healthcare, enterprise IT) accelerate accessibility innovation",
    ],
    teamSize: 15,
    role: "Head of Design",
    overview: {
      deliverables: [
        "Digital Accessibility Strategy 2023 Framework",
        "Enterprise-Wide Inclusive Design Guidelines",
        "Design Evangelism Strategy and Implementation",
        "Global Designer Mentoring and Development Program",
        "Thought Leadership Content Strategy (15+ articles)",
        "Healthcare Technology Accessibility Partnerships",
        "Brand Recognition and Lead Generation Campaigns",
        "Cross-Cultural Design System Standards",
      ],
      teamMembers: [
        "Head of Design (Me)",
        "Senior UX Designers (5)",
        "Visual Designers (4)",
        "Design Researchers (2)",
        "Accessibility Specialists (2)",
        "Content Strategists (2)",
        "Design Operations Manager",
        "Brand Strategy Consultant",
      ],
      timelineDuration: "8 months (Mar 2022 - Oct 2022)",
      toolsUsed: [
        "Enterprise Design Systems",
        "WCAG 2.1 AA Compliance Tools",
        "Global Collaboration Platforms",
        "Content Management Systems",
        "Design Analytics and Metrics Tools",
        "Accessibility Testing Suites",
        "Brand Strategy Frameworks",
      ],
    },
    constraints: {
      technical: [
        "Enterprise-scale design system implementation across global teams",
        "Accessibility compliance requirements for healthcare and government clients",
        "Multi-platform design consistency across 36 country operations",
        "Integration with existing enterprise IT consulting workflows",
      ],
      environmental: [
        "Rapid organizational growth from 15,000 to 18,000+ employees during tenure",
        "Competitive pressure in enterprise IT consulting market during 2022",
        "Regulatory shifts toward accessibility compliance across multiple industries",
        "Cultural diversity challenges across global team collaboration",
      ],
      location: [
        "36-country global presence requiring localized design approaches",
        "Healthcare accessibility regulations varying by geographic region",
        "Enterprise client compliance requirements across different markets",
        "Time zone coordination for global design team collaboration",
      ],
    },
    roleNarrative:
      "I was Head of Design at Nagarro from March to October 2022. The scale number that gets quoted \u2014 18,000+ people across 36 countries \u2014 is the organization, not my team. I had direct authority over 15 designers and influence over everyone else, which is the honest shape of design leadership at this size and worth stating plainly: I could set direction, author frameworks and make the case, but I could not mandate adoption outside my own group. Nearly every decision below is therefore about persuasion rather than control.",
    decisions: [
      {
        title: "Aiming past the compliance floor",
        decision:
          "I wrote the Digital Accessibility Strategy 2023 to target genuinely usable design rather than the WCAG conformance bar, knowing conformance was the only part anyone could audit.",
        rationale:
          "Meeting the standard is measurable, defensible and easy to fund; it is also entirely possible to pass an audit and ship something a disabled user cannot actually use. Aiming at real usability meant committing to a goal I could not prove with a score, in an IT consultancy where unmeasurable goals are the first ones cut. The compliance floor stayed in the strategy as the minimum, not the target \u2014 which cost me the simpler story and a cleaner metric to report against.",
      },
      {
        title: "Evangelism instead of enforcement",
        decision:
          "With no authority over the wider organization, I positioned design as a business driver and invested in advocacy, content and mentoring rather than trying to mandate standards through process.",
        rationale:
          "The instinct at this scale is to write a policy and attach it to a delivery gate. In an organization of 18,000 where I directly led 15, a mandate I could not enforce would have produced compliance theatre and quiet resentment from teams who did not report to me. Persuasion is slower, has no completion date, and is much harder to show progress on \u2014 but it was the only lever that actually existed.",
        outcome:
          "Positioning design as a strategic business driver rather than an operational requirement increased adoption threefold, and the mentor-coaching program improved junior designer retention by 40%. The content strategy reached 10K+ subscribers and generated 100+ qualified leads, which is what made the design function legible to the business.",
      },
    ],
    processStory: {
      background:
        "When I joined Nagarro as Head of Design in March 2022, the company was in a critical growth phase, scaling from 15,000 to 18,000+ employees while competing in the increasingly sophisticated enterprise IT consulting market. The design function existed but lacked strategic vision and organizational impact. With regulatory pressure mounting around digital accessibility and clients demanding more inclusive design approaches, Nagarro needed a comprehensive design leadership transformation. The challenge was creating design excellence that could scale across 36 countries, serve diverse clients from healthcare to finance, and establish Nagarro as a leader in accessibility-first design practices.",
      approach:
        "My strategy centered on three pillars: Design Evangelism, Accessibility Leadership, and Global Team Development. Rather than imposing top-down design standards, I developed a design evangelism approach that positioned design as a strategic business driver. The Digital Accessibility Strategy 2023 became our flagship initiative, not just ensuring compliance but creating competitive advantage through inclusive design excellence. I established a mentor-coaching program for 15+ global designers, focusing on capability development rather than just task management. Content strategy became our external voice, with 15+ thought leadership articles reaching 10,000+ subscribers and positioning Nagarro at the forefront of accessibility innovation.",
      methodology:
        "The implementation followed a phased approach: Discovery and Assessment (Mar-Apr 2022) involved comprehensive design audit across global teams and client projects. Strategy Development (May-Jun 2022) focused on creating the Digital Accessibility Strategy 2023 and inclusive design frameworks. Team Development (Jul-Aug 2022) emphasized designer mentoring, capability building, and retention improvement. Market Positioning (Sep-Oct 2022) launched thought leadership content and strategic partnerships. Each phase included measurable outcomes: brand recognition tracking, lead generation metrics, designer satisfaction surveys, and client accessibility compliance achievements. The healthcare technology partnership with ADT Health provided real-world validation of our accessibility frameworks.",
      keyInsights: [
        "Design Evangelism Over Enforcement: Positioning design as strategic business driver rather than operational requirement increased adoption by 3x and improved designer retention by 40%.",
        "Accessibility as Competitive Advantage: The Digital Accessibility Strategy 2023 didn't just ensure compliance—it created differentiation that directly contributed to 100+ qualified leads and 25% lead generation increase.",
        "Global Team Development ROI: Investing in 15+ designer mentoring and capability building improved retention by 40% while reducing recruitment costs and accelerating project delivery.",
        "Content Strategy Business Impact: 15+ thought leadership articles reaching 10K+ subscribers generated measurable business outcomes: 50% brand recognition increase, 40% website traffic improvement, and strategic partnership opportunities.",
      ],
      outcome:
        "In 8 months, the design leadership transformation at Nagarro achieved remarkable business impact. The 18,000+ employee organization developed unified design excellence capabilities across 36 countries. Brand recognition increased by 50%, directly contributing to business development success with 100+ qualified leads generated through design thought leadership. The Digital Accessibility Strategy 2023 positioned Nagarro ahead of compliance requirements while creating competitive advantage in healthcare technology, government, and enterprise markets. Designer retention improved by 40% through the mentoring program, while website traffic increased by 40% through strategic content. Most importantly, the accessibility-first design approach opened new market opportunities, including healthcare technology partnerships and government contracts requiring inclusive design expertise.",
      reflection:
        "Leading design transformation at Nagarro during this critical growth period taught me that enterprise design leadership is fundamentally about creating business impact through design excellence. The success wasn't just in the frameworks, strategies, or team development—it was in connecting design capability to measurable business outcomes. The Digital Accessibility Strategy 2023 became more than compliance; it was competitive differentiation. The mentoring program became more than team development; it was organizational capability building. The content strategy became more than thought leadership; it was business development. This experience reinforced that design leadership at enterprise scale requires balancing innovation with operational excellence, global perspective with local relevance, and creative vision with business results. The 8-month tenure demonstrated that strategic design leadership can drive rapid organizational transformation when aligned with business growth objectives.",
    },
  },
  {
    id: "rambis-ui",
    name: "Rambis UI",
    subtitle: "Modern Design System & Component Library",
    slug: "rambis-ui",
    description:
      "A comprehensive design system forked from Chakra UI, reimagined and enhanced to create a unique, production-ready component library with improved accessibility, performance, and developer experience.",
    longDescription:
      "Rambis UI is a component library forked from Chakra UI rather than built from scratch, and redesigned around the friction points that show up in rapid application development while keeping the composability that made the original work. Looking at how developers actually used the framework, I focused on three things: component performance, accessibility beyond WCAG AA, and a more intuitive API surface. It ships 50+ production-ready components, a theming engine, and documentation meant to let teams build consistent, accessible interfaces at scale.",
    category: "Design System",
    categories: ["Design System", "UI/UX", "Open Source"],
    tags: [
      "Design Systems",
      "Component Library",
      "React",
      "TypeScript",
      "Accessibility",
      "Open Source",
      "UI Framework",
      "Developer Tools",
      "Theming",
      "Documentation",
    ],
    link: "https://github.com/randyellis-wealthberry/rambus-ui",
    githubLink: "https://github.com/randyellis-wealthberry/rambus-ui",
    video: "/projects/rambis-ui/rambis.mp4",
    thumbnail: "/projects/rambis-ui/hero-thumbnail.jpg",
    images: [
      "/projects/rambis-ui/component-showcase.jpg",
      "/projects/rambis-ui/design-tokens.jpg",
      "/projects/rambis-ui/accessibility-audit.jpg",
      "/projects/rambis-ui/theme-customization.jpg",
      "/projects/rambis-ui/documentation-site.jpg",
      "/projects/rambis-ui/component-anatomy.jpg",
      "/projects/rambis-ui/performance-metrics.jpg",
    ],
    timeline: "Q3 2024 - Present",
    status: "in-progress",
    technologies: [
      "React",
      "TypeScript",
      "Emotion",
      "Framer Motion",
      "Storybook",
      "Jest",
      "React Testing Library",
      "Webpack",
      "Rollup",
      "MDX",
      "GitHub Actions",
      "Vercel",
    ],
    featured: true,
    metrics: [
      { label: "Components", value: "50+" },
      { label: "Weekly Downloads", value: "2.5K+" },
      { label: "GitHub Stars", value: "150+" },
      { label: "Contributors", value: "12" },
      { label: "Test Coverage", value: "94%" },
      { label: "Accessibility Score", value: "100%" },
    ],
    challenges: [
      "Maintaining backward compatibility while introducing breaking improvements",
      "Balancing flexibility with opinionated design decisions",
      "Optimizing bundle size without sacrificing functionality",
      "Creating comprehensive documentation for complex component APIs",
      "Ensuring consistent behavior across different React versions",
      "Building a sustainable open-source community around the project",
    ],
    solutions: [
      "Implemented semantic versioning with detailed migration guides",
      "Created composable primitives allowing both flexibility and convenience",
      "Developed tree-shaking optimizations to cut bundle size",
      "Built interactive documentation with live code examples and playground",
      "Established comprehensive testing matrix for React 16, 17, and 18",
      "Created contributor guidelines and automated PR review workflows",
    ],
    learnings: [
      "Design system adoption requires balancing innovation with familiarity",
      "Performance optimizations must be measured against real-world usage",
      "Documentation quality directly correlates with community adoption",
      "Accessibility must be built-in, not bolted-on after development",
      "Open source success depends on responsive maintainer engagement",
      "Component APIs should prioritize developer intuition over flexibility",
    ],
    teamSize: 4,
    role: "Lead Design System Architect",
    overview: {
      deliverables: [
        "Design System Architecture",
        "Component Library Development",
        "API Design & Documentation",
        "Performance Optimization",
        "Accessibility Implementation",
        "Theme Engine Development",
        "Testing Strategy",
        "Open Source Community Management",
      ],
      teamMembers: [
        "Lead Design System Architect (Me)",
        "Senior React Developer",
        "UI/UX Designer",
        "Technical Writer",
      ],
      timelineDuration: "6 months (ongoing)",
      toolsUsed: [
        "React & TypeScript",
        "Storybook",
        "Figma",
        "GitHub",
        "Vercel",
        "Chromatic",
        "Bundle Analyzer",
        "Lighthouse",
        "axe DevTools",
      ],
    },
    constraints: {
      environmental: [
        "Competing with established design systems like Material-UI and Ant Design",
        "Supporting diverse development environments and build tools",
        "Maintaining compatibility with various CSS-in-JS solutions",
      ],
      technical: [
        "Bundle size limitations for performance-critical applications",
        "Runtime performance requirements for complex component trees",
        "Server-side rendering compatibility across Next.js versions",
        "TypeScript strict mode compliance without sacrificing usability",
      ],
      location: [
        "Global developer community requiring internationalization support",
        "Documentation must be accessible across different time zones",
        "Component behavior must respect regional accessibility standards",
      ],
    },
    roleNarrative:
      "I lead design-system architecture on Rambis UI, working with three others. It is an ongoing project rather than a finished one, and it started as a fork of Chakra UI rather than a clean sheet \u2014 both of those facts shape every decision below. My lane is the system's architecture and API surface: what a component should be responsible for, what it should refuse to do, and how much rope to give the developer using it.",
    decisions: [
      {
        title: "Forking Chakra UI instead of starting from a clean sheet",
        decision:
          "I built Rambis UI as a fork of Chakra UI, inheriting its component API rather than designing a new one.",
        rationale:
          "Adoption is the hard part of a design system, not construction. A new API means every developer who picks it up has to relearn primitives they already know, and that cost is paid by every single user, forever. Starting from an API people already had in their hands meant the switching cost was close to zero. What I gave up was control of the foundation: I inherited Chakra's design decisions wholesale, the good ones and the awkward ones, and some of the awkward ones are now mine to carry.",
        outcome:
          "It was a clean win on speed. Forking got us to something real and usable in a fraction of the time a clean-sheet system would have taken, and the familiar API meant early users needed almost no onboarding.",
      },
      {
        title: "Opinionated defaults with an escape hatch underneath",
        decision:
          "I made the common case a single obvious call, and put the composable primitives underneath for anyone who needed to go further.",
        rationale:
          "The two things a component library is pulled between are intuition and flexibility, and most systems pick one and suffer for it. Fully composable primitives are powerful and leave newcomers assembling boilerplate to do the obvious thing; fully opinionated components are teachable right up until someone needs the case you did not anticipate, and then they eject entirely. Layering them was the way to serve both, and the price is a two-layer API \u2014 twice the surface to document, and a real risk that people never discover the lower layer exists.",
        outcome:
          "The risk landed. People largely did not find the primitives on their own \u2014 they hit the edge of a default and asked rather than dropping down a layer. That is a documentation failure, not an architecture one, and it is mine to fix.",
      },
    ],
    processStory: {
      background:
        "The JavaScript ecosystem was saturated with design systems, yet developers consistently faced the same challenges: bloated bundle sizes, inflexible theming, and poor accessibility defaults. After working with Chakra UI on multiple production projects, I identified specific areas where the framework could be enhanced. Rather than creating yet another design system from scratch, I chose to fork and evolve Chakra UI, leveraging its solid foundation while addressing its limitations. The goal was to create a design system that developers would actually enjoy using—one that got out of their way while providing powerful capabilities when needed.",
      approach:
        "The development of Rambis UI followed a systematic approach to design system evolution. First, I conducted a comprehensive audit of Chakra UI's architecture, identifying pain points through developer surveys and performance profiling. Next, I established core principles: performance by default, accessibility without compromise, and developer experience as a feature. The refactoring process prioritized backward compatibility where possible, with clear migration paths for breaking changes. Each component was redesigned with a focus on composability, allowing developers to build complex interfaces from simple, predictable primitives.",
      methodology:
        "I made the API decisions from usage data rather than taste. Instrumenting the original Chakra UI showed that 80% of developers used only 20% of component props, which is what pushed me toward a streamlined surface with the advanced cases reachable through composition instead of configuration. Performance was benchmarked automatically at every stage to prevent regressions. Accessibility testing went past automated tooling to include users with disabilities, because automated checks confirm conformance and not usability. Documentation was treated as a product in its own right, with user-journey mapping and real information architecture.",
      keyInsights: [
        "Developer Ergonomics Matter: Reducing cognitive load through intuitive APIs increased adoption rates by 60% in pilot projects.",
        "Performance is a Feature: Bundle size optimizations and runtime performance improvements directly correlated with developer satisfaction scores.",
        "Accessibility Drives Innovation: Building for users with disabilities led to better component architecture benefiting all users.",
        "Documentation as Code: Treating documentation with the same rigor as code resulted in 40% fewer support questions.",
        "Community-Driven Development: Open source contributors provided invaluable real-world testing and feature validation.",
      ],
      outcome:
        "Rambis UI is in active development rather than finished. Forking got a usable system into people's hands far faster than building one from scratch would have, and the inherited API meant early adopters had almost nothing to relearn. The clearest signal so far is a negative one: developers are not finding the composable primitives underneath the opinionated defaults on their own, which points at documentation rather than architecture as the next real problem to solve.",
      reflection:
        "Building Rambis UI keeps reinforcing that a design system is judged on developer empathy as much as on technical quality. Forking rather than starting clean is proving to be the right call — it let us build on patterns people already trusted and spend our own time where we actually differ. The open lesson is that good code is the smaller half: the layered API works, but developers are not discovering its lower layer without help, and no amount of architecture fixes what documentation has not explained. That is the part I am still working on.",
    },
  },
  {
    id: "waffle",
    name: "Waffle",
    subtitle: "AI-Powered Interview Scorecard Generator",
    slug: "waffle",
    description:
      "AI-powered interview scorecard generator — paste a job description, get weighted competencies, behavioral questions, and scoring rubrics in 2–4 minutes.",
    longDescription:
      "Waffle is a live, paid, production AI SaaS designed and built end-to-end by Randy Ellis. Recruiters and hiring teams paste a job description and Waffle streams back weighted competencies, behavioral interview questions, and scoring rubrics in 2–4 minutes — replacing hours of manual scorecard drafting with EEOC-compliant, bias-reducing AI content.",
    category: "AI/ML",
    categories: ["AI/ML", "Web Dev"],
    tags: ["AI SaaS", "Interview Tech", "Generative UI", "Recruiting"],
    link: "https://waffle.cards",
    video: "",
    thumbnail: "/projects/waffle/dashboard.png",
    images: [
      "/projects/waffle/dashboard.png",
      "/projects/waffle/scorecard-overview.png",
      "/projects/waffle/scorecard-questions.png",
      "/projects/waffle/scorecard-templates.png",
    ],
    timeline: "2025 – Present",
    status: "completed",
    technologies: [
      "Next.js 16",
      "AI SDK 6",
      "Claude",
      "Stripe",
      "Neon",
      "Prisma",
      "Clerk",
    ],
    featured: true,
    isLiveProduct: true,
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
