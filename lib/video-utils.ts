/**
 * Video detection and utility functions for consistent video handling across the site
 */

/**
 * Checks if a URL is a video URL (Vimeo, YouTube, etc.)
 */
export function isVideoUrl(url: string): boolean {
  return (
    url.includes("player.vimeo.com") ||
    url.includes("vimeo.com") ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  );
}

/**
 * Checks if a URL is specifically a Vimeo URL
 */
export function isVimeoUrl(url: string): boolean {
  return url.includes("vimeo.com") || url.includes("player.vimeo.com");
}

/**
 * Checks if a URL is specifically a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/**
 * Determines the video type from a URL
 */
export function getVideoType(
  url: string,
): "vimeo" | "youtube" | "other" | null {
  if (isVimeoUrl(url)) return "vimeo";
  if (isYouTubeUrl(url)) return "youtube";
  if (isVideoUrl(url)) return "other";
  return null;
}

/**
 * Extracts video ID from Vimeo URL
 */
export function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/\w+\/(\d+)/,
    /vimeo\.com\/groups\/\w+\/videos\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
