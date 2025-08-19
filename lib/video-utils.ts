/**
 * Video detection and utility functions for consistent video handling across the site
 */

/**
 * Checks if a URL is a video URL (Vimeo, YouTube, etc.)
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;

  return (
    url.includes("player.vimeo.com") ||
    url.includes("vimeo.com") ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  );
}

/**
 * Checks if a string is a UnicornStudio project ID (format: "unicorn:PROJECT_ID" or just "PROJECT_ID")
 */
export function isUnicornStudioId(id: string): boolean {
  if (!id) return false;

  // Check for explicit unicorn: prefix
  if (id.startsWith("unicorn:")) {
    return id.length > 8; // Must have content after "unicorn:"
  }

  // Check for UnicornStudio project ID pattern (alphanumeric string)
  // UnicornStudio project IDs are typically long alphanumeric strings
  const unicornIdPattern = /^[A-Za-z0-9]{16,}$/;
  return unicornIdPattern.test(id);
}

/**
 * Checks if a URL is specifically a Vimeo URL
 */
export function isVimeoUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("vimeo.com") || url.includes("player.vimeo.com");
}

/**
 * Checks if a URL is specifically a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/**
 * Extracts UnicornStudio project ID from a string (removes "unicorn:" prefix if present)
 */
export function extractUnicornStudioId(id: string): string | null {
  if (!isUnicornStudioId(id)) return null;

  if (id.startsWith("unicorn:")) {
    return id.substring(8);
  }

  return id;
}

/**
 * Determines the video type from a URL
 */
export function getVideoType(
  url: string,
): "vimeo" | "youtube" | "unicorn" | "other" | null {
  if (!url) return null;
  if (isUnicornStudioId(url)) return "unicorn";
  if (isVimeoUrl(url)) return "vimeo";
  if (isYouTubeUrl(url)) return "youtube";
  if (isVideoUrl(url)) return "other";
  return null;
}

/**
 * Extracts video ID from Vimeo URL
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;

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
