/**
 * CDN Resource Hints Component
 * Provides DNS prefetch, preconnect, preload, and prefetch hints for optimal CDN performance
 */

interface PreconnectHint {
  href: string;
  crossOrigin?: "anonymous" | "use-credentials";
}

interface PreloadHint {
  href: string;
  as: "font" | "image" | "script" | "style" | "manifest" | "document";
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  media?: string;
}

const RESOURCE_HINTS = {
  // DNS prefetching for external domains
  dnsPrefetch: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://images.unsplash.com",
    "https://cdn.cosmos.so",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://vercel.live",
  ],

  // Preconnect for critical third-party origins
  preconnect: [
    { href: "https://fonts.googleapis.com" },
    { href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { href: "https://www.googletagmanager.com" },
    { href: "https://vercel.live" },
  ] as PreconnectHint[],

  // Preload for critical resources
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
  ] as PreloadHint[],

  // Prefetch for likely navigation
  prefetch: ["/projects", "/about", "/contact", "/_next/static/css/app.css"],
};

export function DNSPrefetchHints() {
  return (
    <>
      {RESOURCE_HINTS.dnsPrefetch.map((href) => (
        <link key={href} rel="dns-prefetch" href={href} />
      ))}
    </>
  );
}

export function PreconnectHints() {
  return (
    <>
      {RESOURCE_HINTS.preconnect.map(({ href, crossOrigin }) => (
        <link
          key={href}
          rel="preconnect"
          href={href}
          {...(crossOrigin && { crossOrigin })}
        />
      ))}
    </>
  );
}

export function PreloadHints() {
  return (
    <>
      {RESOURCE_HINTS.preload.map(({ href, as, type, crossOrigin, media }) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as={as}
          {...(type && { type })}
          {...(crossOrigin && { crossOrigin })}
          {...(media && { media })}
        />
      ))}
    </>
  );
}

export function PrefetchHints() {
  return (
    <>
      {RESOURCE_HINTS.prefetch.map((href) => (
        <link key={href} rel="prefetch" href={href} />
      ))}
    </>
  );
}

export default function ResourceHints() {
  return (
    <>
      <DNSPrefetchHints />
      <PreconnectHints />
      <PreloadHints />
      <PrefetchHints />
    </>
  );
}

// Utility function to get resource hints configuration
export function getResourceHintsConfig() {
  return RESOURCE_HINTS;
}
