// Core types for the application data
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
  archived?: boolean;
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

export type WorkExperience = {
  id: string;
  company: string;
  title: string;
  link: string;
  start: string;
  end: string;
  description: string[];
};

export type BlogPost = {
  uid: string;
  title: string;
  description: string;
  link: string;
};

export type SocialLink = {
  label: string;
  link: string;
};

export type ArchiveItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  category: string;
  type: "project" | "article" | "video" | "course" | "document";
  thumbnail?: string;
  video?: string;
  link?: string;
  featured?: boolean;
  tags: string[];
  company?: string;
  event?: string;
};

export const PROJECT_CATEGORIES = [
  "All",
  "Enterprise (SaaS)",
  "Mobile App",
  "Web Development",
  "Design Systems",
  "UI/UX",
  "AI/ML",
] as const;

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
