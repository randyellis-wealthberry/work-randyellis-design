/**
 * Utility functions for generating random Unsplash images for resource cards
 * Following TDD approach to ensure all test cases pass
 */

import React from "react";

export interface ResourceCard {
  id: string;
  title: string;
  description: string;
  url: string;
  isExternal: boolean;
  imageCategory: string;
  icon: React.ComponentType<{ className?: string }> | null; // LucideIcon type
}

/**
 * Generates a random seed number for image URLs
 * Combines timestamp and random number for uniqueness
 */
export function generateRandomImageSeed(): number {
  // Use timestamp + random number to ensure uniqueness across rapid calls
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return timestamp + random;
}

/**
 * Creates a properly formatted Unsplash URL with category and seed
 * @param category - Image category (e.g., "abstract", "art,geometric")
 * @param seed - Unique seed number for consistent randomization
 * @returns Formatted Unsplash URL
 */
export function createUnsplashUrl(category: string, seed: number): string {
  const baseUrl = "https://source.unsplash.com/400x200";
  return `${baseUrl}/?${category}&sig=${seed}`;
}

/**
 * Validates if a URL is a properly formatted Unsplash URL
 * @param url - URL to validate
 * @returns true if valid Unsplash URL, false otherwise
 */
export function validateUnsplashUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Must be HTTPS
    if (urlObj.protocol !== "https:") {
      return false;
    }

    // Must be from source.unsplash.com
    if (urlObj.hostname !== "source.unsplash.com") {
      return false;
    }

    // Must have the expected path structure
    if (!urlObj.pathname.includes("400x200")) {
      return false;
    }

    // Must have sig parameter
    if (!urlObj.searchParams.has("sig") && !urlObj.search.includes("sig=")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generates unique random images for all resource cards
 * @param cards - Array of resource card configurations
 * @returns Object mapping card IDs to their unique image URLs
 */
export function generateResourceCardImages(
  cards: ResourceCard[],
): Record<string, string> {
  const images: Record<string, string> = {};

  cards.forEach((card) => {
    const category = card.imageCategory || "abstract"; // Fallback for missing category
    const seed = generateRandomImageSeed();
    images[card.id] = createUnsplashUrl(category, seed);

    // Small delay to ensure different timestamps for rapid generation
    // This is a performance trade-off for uniqueness guarantee
    if (cards.length > 1) {
      // Add microsecond-level delay for uniqueness
      const start = performance.now();
      while (performance.now() - start < 0.001) {
        // Minimal busy wait to ensure timestamp difference
      }
    }
  });

  return images;
}

/**
 * Default resource card configurations for the Addvanced project
 * These match the test expectations and component requirements
 */
export const DEFAULT_RESOURCE_CARDS: ResourceCard[] = [
  {
    id: "maze-testing",
    title: "Maze Usability Testing",
    description:
      "Interactive prototype testing results with user behavior analytics and task completion metrics",
    url: "https://t.maze.co/159918816",
    isExternal: true,
    imageCategory: "abstract",
    icon: null, // Will be replaced with actual icon in component
  },
  {
    id: "miro-board",
    title: "Design Process & Wireframes",
    description:
      "Complete design journey including wireframes, user flows, and collaborative design thinking",
    url: "https://miro.com/app/board/o9J_kwGbK00=/",
    isExternal: true,
    imageCategory: "art,geometric",
    icon: null,
  },
  {
    id: "addvance-report",
    title: "Addvance v1 Report",
    description:
      "Work-in-progress prototype evaluation with detailed user journey analysis and insights",
    url: "https://app.maze.co/report/Addvance-v1-WIP/bxqeilh40ohf5/intro",
    isExternal: true,
    imageCategory: "digital,abstract",
    icon: null,
  },
  {
    id: "more-projects",
    title: "View More Projects",
    description:
      "Explore other innovative design solutions and case studies from my portfolio",
    url: "/projects",
    isExternal: false,
    imageCategory: "minimal,design",
    icon: null,
  },
];

/**
 * Performance optimized image generation with caching
 * Stores generated seeds for a brief period to avoid regeneration
 */
let imageCache: { [key: string]: { url: string; timestamp: number } } = {};
const CACHE_DURATION = 1000; // 1 second cache to balance freshness and performance

/**
 * Gets cached image or generates new one if cache is stale
 * @param cardId - Card ID for caching key
 * @param category - Image category
 * @returns Cached or newly generated image URL
 */
export function getCachedOrGenerateImage(
  cardId: string,
  category: string,
): string {
  const now = Date.now();
  const cached = imageCache[cardId];

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.url;
  }

  const seed = generateRandomImageSeed();
  const url = createUnsplashUrl(category, seed);

  imageCache[cardId] = { url, timestamp: now };

  // Clean up old cache entries to prevent memory leaks
  Object.keys(imageCache).forEach((key) => {
    if (now - imageCache[key].timestamp > CACHE_DURATION * 10) {
      delete imageCache[key];
    }
  });

  return url;
}

/**
 * Clears the image cache - useful for testing and cleanup
 */
export function clearImageCache(): void {
  imageCache = {};
}
