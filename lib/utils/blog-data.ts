// Blog data utilities for archive functionality

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  content?: string;
  publishedDate: string;
  readTime: number;
  category: string;
  tags: string[];
  views?: number;
  featured?: boolean;
}

export interface BlogArchiveData {
  articles: BlogArticle[];
  categories: string[];
  totalCount: number;
}

// Mock blog articles data based on existing articles in the project
const mockArticles: BlogArticle[] = [
  {
    slug: "claude-obsidian-workflows",
    title: "Claude + Obsidian: The Ultimate Knowledge Management System",
    description:
      "If you've ever felt overwhelmed by scattered notes and forgotten insights, this workflow will change everything.",
    publishedDate: "2025-01-15",
    readTime: 8,
    category: "Productivity",
    tags: ["claude", "obsidian", "knowledge-management", "workflow"],
    views: 1250,
    featured: true,
  },
  {
    slug: "create-professional-videos-claude-code-guide",
    title: "Creating Professional Videos with Claude Code",
    description:
      "Learn how to leverage Claude Code to create stunning videos programmatically using Remotion and Manim libraries. A comprehensive guide for marketers, developers, and content creators.",
    publishedDate: "2024-12-20",
    readTime: 12,
    category: "Development",
    tags: ["claude-code", "video-generation", "remotion", "manim", "ai"],
    views: 890,
    featured: true,
  },
  {
    slug: "exploring-the-intersection-of-design-ai-and-design-engineering",
    title: "Exploring the Intersection of Design, AI, and Design Engineering",
    description:
      "A deep dive into how artificial intelligence is transforming the design engineering landscape and what it means for the future of product development.",
    publishedDate: "2024-11-15",
    readTime: 6,
    category: "Design",
    tags: ["design", "ai", "design-engineering", "future"],
    views: 675,
    featured: false,
  },
  {
    slug: "profits-not-pixels",
    title: "Profits, Not Pixels: Why Business Impact Matters",
    description:
      "Understanding how to balance design perfection with business outcomes and why focusing on impact over aesthetics leads to better results.",
    publishedDate: "2024-10-30",
    readTime: 5,
    category: "Business",
    tags: ["business", "design-strategy", "impact", "roi"],
    views: 1120,
    featured: false,
  },
];

/**
 * Get all blog articles
 */
export function getBlogArticles(): BlogArticle[] {
  return mockArticles.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );
}

/**
 * Get latest articles sorted by publication date
 */
export function getLatestArticles(count: number = 3): BlogArticle[] {
  return getBlogArticles().slice(0, count);
}

/**
 * Get popular articles sorted by views
 */
export function getPopularArticles(count: number = 3): BlogArticle[] {
  return getBlogArticles()
    .filter((article) => article.views && article.views > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, count);
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(): BlogArticle[] {
  return getBlogArticles().filter((article) => article.featured);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): BlogArticle[] {
  return getBlogArticles().filter(
    (article) => article.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const categories = new Set(
    getBlogArticles().map((article) => article.category),
  );
  return Array.from(categories).sort();
}

/**
 * Get blog archive data
 */
export function getBlogArchiveData(): BlogArchiveData {
  const articles = getBlogArticles();
  return {
    articles,
    categories: getCategories(),
    totalCount: articles.length,
  };
}
