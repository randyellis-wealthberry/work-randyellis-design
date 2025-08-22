import { WorkExperience, BlogPost, SocialLink, ArchiveItem } from "./types";

// Static data that's commonly used across pages
export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: "Wealthberry Labs",
    title: "Head of Product",
    start: "Oct 2022",
    end: "Present",
    link: "https://www.buildyourlegacywithai.com",
    id: "work1",
    description: [
      "Leading product strategy for wealth management platform serving HNW clients",
      "Built design team and established design systems across multiple products",
      "Increased user engagement by 150% through data-driven UX improvements",
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
    title: "Claude + Obsidian: The Ultimate Knowledge Management System",
    description:
      "Transform two tools into a knowledge management system that revolutionizes how you capture, connect, and leverage information.",
    link: "/blog/claude-obsidian-workflows",
    uid: "blog-9",
  },
  {
    title: "Creating Professional Videos with Claude Code",
    description:
      "A comprehensive guide to creating professional videos with Claude Code using Remotion and Manim.",
    link: "/blog/create-professional-videos-claude-code-guide",
    uid: "blog-8",
  },
  {
    title: "Profits, Not Pixels: Why Business Impact Matters",
    description:
      "How the design job market shifted from aesthetics to business impact and ROI.",
    link: "/blog/profits-not-pixels",
    uid: "blog-6",
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

export const ARCHIVE_CATEGORIES = [
  "All",
  "Article",
  "Project",
  "Video",
  "Course",
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
    link: "/blog/design-systems-at-scale",
    featured: true,
    tags: ["Design Systems", "UI/UX", "Frontend"],
  },
  {
    id: "project-placeholder-1",
    title: "AI Design Generator",
    subtitle: "Automated Component Creation",
    description:
      "An experimental project exploring AI-powered design system generation and component automation.",
    year: "2023",
    category: "Project",
    type: "project",
    thumbnail: "/images/archive/project-placeholder-1.jpg",
    link: "/projects/ai-design-generator",
    featured: true,
    tags: ["AI/ML", "Design Systems", "Automation"],
  },
  {
    id: "video-placeholder-1",
    title: "Design Leadership Workshop",
    subtitle: "Building High-Performance Teams",
    description:
      "A workshop recording on building and leading design teams in fast-growing companies.",
    year: "2023",
    category: "Video",
    type: "video",
    thumbnail: "/images/archive/video-placeholder-1.jpg",
    link: "https://youtube.com/watch?v=example",
    featured: false,
    tags: ["Leadership", "Team Building", "Design"],
  },
];
