import React from "react";

// Critical CSS that should be inlined for fastest LCP
export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      /* Critical above-the-fold styles */
      
      /* Critical layout styles */
      body {
        margin: 0;
        padding: 0;
        font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.6;
      }

      /* Prevent layout shift from loading states */
      .hero-section {
        min-height: 400px;
        contain: layout style paint;
      }

      .project-thumbnail {
        aspect-ratio: 16/9;
        contain: layout style paint;
      }

      /* Critical button styles */
      button, .btn {
        cursor: pointer;
        border: none;
        outline: none;
        background: transparent;
        font-family: inherit;
        transition: opacity 0.2s ease;
      }

      button:hover, .btn:hover {
        opacity: 0.8;
      }

      /* Loading states to prevent CLS */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0a0a0a;
          color: #ffffff;
        }

        .loading-skeleton {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
      }

      /* Intersection observer fallback */
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }

      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Critical responsive breakpoints */
      @media (max-width: 768px) {
        .hero-section {
          min-height: 300px;
        }
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Focus styles for accessibility */
      button:focus-visible, 
      a:focus-visible,
      [tabindex]:focus-visible {
        outline: 2px solid #0070f3;
        outline-offset: 2px;
      }

      /* Optimize for Core Web Vitals */
      img, video, iframe {
        max-width: 100%;
        height: auto;
      }

      /* Prevent FOUC (Flash of Unstyled Content) */
      html {
        visibility: visible;
      }
    `,
      }}
    />
  );
}

// Resource hints component for performance
export function ResourceHints() {
  return (
    <>
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//vercel.com" />
      <link rel="dns-prefetch" href="//analytics.google.com" />

      {/* Preconnect to critical origins */}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://vercel.live"
        crossOrigin="anonymous"
      />

      {/* Module preload for critical JavaScript */}
      <link rel="modulepreload" href="/_next/static/chunks/main.js" />
      <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />

      {/* Prefetch critical routes */}
      <link rel="prefetch" href="/projects" />
      <link rel="prefetch" href="/about" />

      {/* Preload critical images */}
      <link
        rel="preload"
        as="image"
        href="/images/randyellis-official-avatar.png"
      />

      {/* Viewport meta for responsive design */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />

      {/* Theme color for PWA */}
      <meta name="theme-color" content="#ffffff" />
      <meta
        name="theme-color"
        content="#000000"
        media="(prefers-color-scheme: dark)"
      />

      {/* Performance hints */}
      <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta
        httpEquiv="Referrer-Policy"
        content="strict-origin-when-cross-origin"
      />
    </>
  );
}
