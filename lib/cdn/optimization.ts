/**
 * CDN Optimization Utilities
 * Provides functions for optimizing resource delivery through CDN
 */

export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate?: number;
  immutable?: boolean;
  public?: boolean;
}

export interface ImageOptimizationConfig {
  quality?: number;
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "png" | "jpg";
}

// Cache configurations for different resource types
export const CACHE_STRATEGIES = {
  STATIC_ASSETS: {
    maxAge: 31536000, // 1 year
    immutable: true,
    public: true,
  },
  IMAGES: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 1 day
    public: true,
  },
  FONTS: {
    maxAge: 31536000, // 1 year
    immutable: true,
    public: true,
  },
  DYNAMIC: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 3600, // 1 hour
    public: true,
  },
  API: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 1800, // 30 minutes
    public: true,
  },
} as const;

/**
 * Generate Cache-Control header value
 */
export function generateCacheControl(config: CacheConfig): string {
  const parts: string[] = [];

  if (config.public) {
    parts.push("public");
  }

  parts.push(`max-age=${config.maxAge}`);

  if (config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.immutable) {
    parts.push("immutable");
  }

  return parts.join(", ");
}

/**
 * Get cache headers for a given resource type
 */
export function getCacheHeaders(resourceType: keyof typeof CACHE_STRATEGIES) {
  const config = CACHE_STRATEGIES[resourceType];
  const cacheControl = generateCacheControl(config);

  return {
    "Cache-Control": cacheControl,
    "CDN-Cache-Control": `public, max-age=${config.maxAge}`,
    "Vercel-CDN-Cache-Control": `max-age=${config.maxAge}`,
  };
}

/**
 * Generate optimized image URL with Next.js Image optimization
 */
export function generateOptimizedImageUrl(
  src: string,
  config: ImageOptimizationConfig = {},
): string {
  const params = new URLSearchParams();

  if (config.width) {
    params.set("w", config.width.toString());
  }

  if (config.quality) {
    params.set("q", config.quality.toString());
  }

  if (config.format && config.format !== "jpg") {
    params.set("fm", config.format);
  }

  const query = params.toString();
  return query ? `${src}?${query}` : src;
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  src: string,
  sizes: number[],
  quality = 75,
): string {
  return sizes
    .map((size) => {
      const optimizedUrl = generateOptimizedImageUrl(src, {
        width: size,
        quality,
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(", ");
}

/**
 * Check if a URL is allowed for external image optimization
 */
export function isAllowedImageSource(src: string): boolean {
  const allowedPatterns = [
    /^\//, // Relative paths
    /^https:\/\/images\.unsplash\.com\//,
    /^https:\/\/cdn\.cosmos\.so\//,
    /^https:\/\/work\.randyellis\.design\//,
  ];

  return allowedPatterns.some((pattern) => pattern.test(src));
}

/**
 * Get quality setting based on image context
 */
export function getImageQuality(
  context: "thumbnail" | "gallery" | "hero" | "default",
): number {
  const qualityMap = {
    thumbnail: 60,
    gallery: 80,
    hero: 85,
    default: 75,
  };

  return qualityMap[context];
}

/**
 * Generate resource hint links for better performance
 */
export function generateResourceHints() {
  return {
    dnsPrefetch: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://images.unsplash.com",
      "https://cdn.cosmos.so",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://vercel.live",
    ],
    preconnect: [
      { href: "https://fonts.googleapis.com" },
      { href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { href: "https://www.googletagmanager.com" },
      { href: "https://vercel.live" },
    ],
    preload: [
      {
        href: "/fonts/geist-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        href: "/fonts/geist-mono-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        href: "/manifest.json",
        as: "manifest",
      },
    ],
    prefetch: ["/projects", "/about", "/contact", "/_next/static/css/app.css"],
  };
}

/**
 * Preload critical resources programmatically
 */
export function preloadCriticalResources() {
  if (typeof window === "undefined") return;

  const hints = generateResourceHints();

  // Preload critical fonts
  hints.preload.forEach(({ href, as, type, crossOrigin }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}

/**
 * Get device pixel ratio for optimized image loading
 */
export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
}

/**
 * Calculate optimal image dimensions based on container and DPR
 */
export function calculateOptimalImageSize(
  containerWidth: number,
  containerHeight?: number,
): { width: number; height?: number } {
  const dpr = getDevicePixelRatio();
  const width = Math.ceil(containerWidth * dpr);
  const height = containerHeight ? Math.ceil(containerHeight * dpr) : undefined;

  return { width, height };
}

/**
 * Generate critical CSS for above-the-fold content
 */
export function generateCriticalCSS(): string {
  // This would typically be generated by a tool like Critical or Critters
  // For now, return a basic critical CSS structure
  return `
    /* Critical CSS for above-the-fold content */
    html, body { margin: 0; padding: 0; }
    body { font-family: var(--font-geist); }
    .header { display: flex; align-items: center; }
    .hero { min-height: 100vh; }
  `;
}

/**
 * Check if service worker is available for caching strategies
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

/**
 * Register service worker for additional caching
 */
export async function registerServiceWorker(swPath = "/sw.js"): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log("Service Worker registered:", registration);
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}
