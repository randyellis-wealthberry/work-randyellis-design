export interface ArticleMetadata {
  wordCount: number;
  imageCount: number;
  codeBlockCount: number;
  complexityScore: number;
  publishDate?: string;
  lastModified?: string;
  keywords?: string[];
  description?: string;
  title?: string;
}

export interface BlogPostMetadata {
  title: string;
  description: string;
  publishDate: string;
  lastModified?: string;
  keywords: string[];
  readTime: number;
  wordCount: number;
  imageCount: number;
  slug: string;
  url: string;
}

/**
 * Calculate basic read time based on average reading speed
 * @param content - The text content to analyze
 * @returns Read time in minutes (minimum 1 minute)
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) return 1;

  const minutes = wordCount / wordsPerMinute;
  return Math.ceil(minutes);
}

/**
 * Calculate advanced read time including images and code blocks
 * @param content - The text content to analyze
 * @param metadata - Optional metadata about the article
 * @returns Read time in minutes including adjustments for media
 */
export function calculateAdvancedReadTime(
  content: string,
  metadata?: ArticleMetadata,
): number {
  const baseWPM = 200;
  const imageTimeSeconds = 12; // seconds per image
  const codeBlockTimeSeconds = 30; // seconds per code block

  // Calculate base reading time
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;
  const baseTimeMinutes = wordCount / baseWPM;

  // Add time for images and code blocks if metadata is provided
  let additionalTimeMinutes = 0;
  if (metadata) {
    const imageTimeMinutes = (metadata.imageCount * imageTimeSeconds) / 60;
    const codeTimeMinutes =
      (metadata.codeBlockCount * codeBlockTimeSeconds) / 60;
    additionalTimeMinutes = imageTimeMinutes + codeTimeMinutes;
  }

  const totalTimeMinutes = baseTimeMinutes + additionalTimeMinutes;
  return Math.ceil(totalTimeMinutes);
}

/**
 * Extract metadata from MDX content including images and code blocks
 * @param content - Raw MDX content
 * @returns ArticleMetadata with counts and analysis
 */
export function extractMDXMetadata(content: string): ArticleMetadata {
  // Remove frontmatter and MDX imports
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import.*$/gm, "")
    .replace(/^export.*$/gm, "");

  // Count words (excluding code blocks)
  const contentWithoutCode = cleanContent.replace(/```[\s\S]*?```/g, "");
  const words = contentWithoutCode
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  // Count images
  const imageMatches = content.match(/!\[.*?\]\(.*?\)|<img[^>]*>/g) || [];
  const imageCount = imageMatches.length;

  // Count code blocks
  const codeBlockMatches = content.match(/```[\s\S]*?```|`[^`]+`/g) || [];
  const codeBlockCount = codeBlockMatches.length;

  // Calculate complexity score (higher = more complex)
  const complexityScore = Math.min(
    Math.round(
      (wordCount / 1000) * 0.6 +
        (imageCount / 5) * 0.2 +
        (codeBlockCount / 10) * 0.2,
    ),
    10,
  );

  return {
    wordCount,
    imageCount,
    codeBlockCount,
    complexityScore,
  };
}

/**
 * Extract keywords from blog post content for SEO
 * @param content - The blog post content
 * @param title - The blog post title
 * @returns Array of relevant keywords
 */
export function extractKeywords(content: string, title: string): string[] {
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
  ]);

  // Extract words from title and content
  const text = `${title} ${content}`.toLowerCase();
  const words = text
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));

  // Count word frequency
  const wordCount = words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Generate blog post metadata for SEO and structured data
 * @param content - Raw MDX content
 * @param slug - Blog post slug
 * @param baseUrl - Base website URL
 * @returns Complete BlogPostMetadata
 */
export function generateBlogPostMetadata(
  content: string,
  slug: string,
  baseUrl: string = "https://work.randyellis.design",
): BlogPostMetadata | null {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const metadata = extractMDXMetadata(content);

  // Parse frontmatter fields
  const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
  const descriptionMatch = frontmatter.match(
    /description:\s*["']?(.*?)["']?$/m,
  );
  const dateMatch = frontmatter.match(/date:\s*["']?(.*?)["']?$/m);

  if (!titleMatch || !descriptionMatch) return null;

  const title = titleMatch[1];
  const description = descriptionMatch[1];
  const publishDate = dateMatch
    ? dateMatch[1]
    : new Date().toISOString().split("T")[0];

  // Calculate reading time
  const readTime = calculateAdvancedReadTime(content, metadata);

  // Extract keywords
  const keywords = extractKeywords(content, title);

  return {
    title,
    description,
    publishDate,
    keywords,
    readTime,
    wordCount: metadata.wordCount,
    imageCount: metadata.imageCount,
    slug,
    url: `${baseUrl}/blog/${slug}`,
  };
}
