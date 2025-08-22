export interface ArticleMetadata {
  wordCount: number;
  imageCount: number;
  codeBlockCount: number;
  complexityScore: number;
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
