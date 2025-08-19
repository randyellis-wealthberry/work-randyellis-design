"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import * as React from "react";

// Loading skeletons for better UX during component loading
export function ComponentSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className || ""}`}>
      <div className="mb-2 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-2 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 ${className || "h-48 w-full"}`}
    />
  );
}

export function VideoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 ${className || "aspect-video w-full"}`}
    >
      <div className="flex h-full items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-600">
          <svg
            className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Dynamically imported components with loading states
export const LazyTerminal = dynamic(
  () =>
    import("@/components/magicui/terminal").then((mod) => ({
      default: mod.Terminal,
    })),
  {
    loading: () => (
      <ComponentSkeleton className="h-32 rounded-lg bg-zinc-900 dark:bg-zinc-100" />
    ),
    ssr: false,
  },
);

export const LazyTransitionPanel = dynamic(
  () =>
    import("@/components/motion-primitives/transition-panel").then((mod) => ({
      default: mod.TransitionPanel,
    })),
  {
    loading: () => <ComponentSkeleton className="h-32" />,
    ssr: true,
  },
);

export const LazyAccordion = dynamic(
  () =>
    import("@/components/ui/accordion").then((mod) => ({
      default: mod.Accordion,
    })),
  {
    loading: () => <ComponentSkeleton className="space-y-4" />,
    ssr: true,
  },
);

export const LazyAnimatedBackground = dynamic(
  () =>
    import("@/components/ui/animated-background").then((mod) => ({
      default: mod.AnimatedBackground,
    })),
  {
    loading: () => <ComponentSkeleton />,
    ssr: false,
  },
);

export const LazySpotlight = dynamic(
  () =>
    import("@/components/ui/spotlight").then((mod) => ({
      default: mod.Spotlight,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

export const LazyMagnetic = dynamic(
  () =>
    import("@/components/ui/magnetic").then((mod) => ({
      default: mod.Magnetic,
    })),
  {
    loading: () => <span>Loading...</span>,
    ssr: false,
  },
);

// Heavy 3D components that should only load when needed
// export const LazyWebGLComponent = dynamic(
//   () => import("@/components/three/webgl-scene"),
//   {
//     loading: () => <ImageSkeleton className="aspect-video w-full rounded-lg" />,
//     ssr: false,
//   },
// );

// Note: LazyThreeCanvas removed to prevent server-side THREE.js import issues
// Use individual WebGL components via dynamic imports instead

// Optimized video component with intersection observer
export const LazyHoverVideoOptimized = dynamic(
  () =>
    import("@/components/ui/lazy-hover-video")
      .then((mod) => ({
        default: mod.LazyHoverVideo,
      }))
      .catch((error) => {
        console.error("Failed to load LazyHoverVideo:", error);
        return {
          default: () => <VideoSkeleton />,
        };
      }),
  {
    loading: () => <VideoSkeleton />,
    ssr: false,
  },
);

// Newsletter component that can be deferred
export const LazyNewsletterSignup = dynamic(
  () =>
    import("@/components/ui/newsletter-signup").then((mod) => ({
      default: mod.NewsletterSignup,
    })),
  {
    loading: () => <ComponentSkeleton className="h-20" />,
    ssr: true,
  },
);

// Analytics components that can load later
export const LazyGoogleAnalytics = dynamic(
  () =>
    import("@/components/analytics/google-analytics").then((mod) => ({
      default: mod.GoogleAnalytics,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

export const LazyCookieConsent = dynamic(
  () =>
    import("@/components/ui/cookie-consent").then((mod) => ({
      default: mod.CookieConsent,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

// Enhanced HOC for intersection observer-based lazy loading with optimizations
export function withIntersectionObserver<T extends object>(
  Component: React.ComponentType<T>,
  options: IntersectionObserverInit & {
    priority?: "high" | "medium" | "low";
    enablePreloading?: boolean;
    preloadDistance?: number;
  } = {},
) {
  return function IntersectionObserverWrapper(props: T) {
    const [isInView, setIsInView] = React.useState(false);
    const [shouldPreload, setShouldPreload] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    const {
      priority = "medium",
      enablePreloading = true,
      preloadDistance = 150,
      ...observerOptions
    } = options;

    React.useEffect(() => {
      if (!ref.current) return;

      // Create main observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin:
            priority === "high"
              ? "200px"
              : priority === "medium"
                ? "100px"
                : "50px",
          threshold: 0.01,
          ...observerOptions,
        },
      );

      // Create preload observer for high priority components
      let preloadObserver: IntersectionObserver | null = null;
      if (enablePreloading && priority === "high") {
        preloadObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setShouldPreload(true);
              preloadObserver?.disconnect();
            }
          },
          {
            rootMargin: `${preloadDistance}px`,
            threshold: 0,
          },
        );
        preloadObserver.observe(ref.current);
      }

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
        preloadObserver?.disconnect();
      };
    }, [priority, enablePreloading, preloadDistance, observerOptions]);

    return (
      <div ref={ref}>
        {isInView || shouldPreload ? (
          <Component {...props} />
        ) : (
          <ComponentSkeleton />
        )}
      </div>
    );
  };
}

ComponentSkeleton.displayName = "ComponentSkeleton";
ImageSkeleton.displayName = "ImageSkeleton";
VideoSkeleton.displayName = "VideoSkeleton";

// Wrapper for Suspense boundaries with error boundaries
export function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <ComponentSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Simple error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Connection interface
interface Connection {
  effectiveType: string;
  addEventListener: (event: string, handler: () => void) => void;
  removeEventListener: (event: string, handler: () => void) => void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
}

// Hook for connection-aware loading
export function useConnectionAwareLoading() {
  const [connectionType, setConnectionType] = React.useState<string>("4g");

  React.useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      setConnectionType(connection.effectiveType);

      const handleChange = () => {
        setConnectionType(connection.effectiveType);
      };

      connection.addEventListener("change", handleChange);
      return () => connection.removeEventListener("change", handleChange);
    }
  }, []);

  const shouldLoadHeavyContent = React.useMemo(() => {
    return connectionType === "4g" || connectionType === "3g";
  }, [connectionType]);

  const shouldPreloadImages = React.useMemo(() => {
    return connectionType === "4g";
  }, [connectionType]);

  return {
    connectionType,
    shouldLoadHeavyContent,
    shouldPreloadImages,
  };
}

// Resource preloader component with enhanced prioritization
export function ResourcePreloader({
  resources,
  priority = "medium",
  delay = 0,
}: {
  resources: string[];
  priority?: "high" | "medium" | "low";
  delay?: number;
}) {
  React.useEffect(() => {
    const preloadResources = () => {
      resources.forEach((resource, index) => {
        const link = document.createElement("link");

        // Set appropriate rel based on priority and resource type
        if (priority === "high") {
          link.rel = "preload";
          if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
            link.as = "image";
          } else if (resource.match(/\.(mp4|webm|ogg)$/i)) {
            link.as = "video";
          }
        } else {
          link.rel = "prefetch";
        }

        link.href = resource;

        // Add staggered delay for better performance
        const resourceDelay = priority === "high" ? index * 50 : index * 200;

        setTimeout(() => {
          // Add to head if not already present
          if (!document.querySelector(`link[href="${resource}"]`)) {
            document.head.appendChild(link);
          }
        }, resourceDelay);
      });
    };

    const startPreloading = () => {
      setTimeout(preloadResources, delay);
    };

    // Use requestIdleCallback for low priority, immediate for high priority
    if (priority === "high") {
      startPreloading();
    } else if ("requestIdleCallback" in window) {
      requestIdleCallback(startPreloading);
    } else {
      setTimeout(startPreloading, 2000);
    }
  }, [resources, priority, delay]);

  return null;
}

// Export optimized components
export { OptimizedLazyImage } from "@/components/ui/optimized-lazy-image";
export { OptimizedLazyVideo } from "@/components/ui/optimized-lazy-video";
export { OptimizedWebGLLoader } from "@/components/ui/optimized-webgl-loader";
export { useOptimizedLazyLoading } from "@/lib/hooks/use-optimized-lazy-loading";
