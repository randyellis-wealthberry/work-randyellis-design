/**
 * Advanced Lazy Loading Utilities for Optimal Performance
 * Implements intelligent loading strategies for heavy components
 */

import {
  type ComponentType,
  useState,
  useEffect,
  useRef,
} from "react";
import dynamic from "next/dynamic";

// Performance-aware lazy loading with preload hints
export function createOptimizedLazyComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    fallback?: React.ReactNode;
    preload?: boolean;
    ssr?: boolean;
  } = {},
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => options.fallback || null,
    ssr: options.ssr ?? false,
  });

  // Preload component on hover/focus for instant loading
  const PreloadWrapper = (props: T) => {
    const handlePreload = () => {
      if (options.preload !== false) {
        importFn(); // Trigger preload
      }
    };

    return (
      <div onMouseEnter={handlePreload} onFocus={handlePreload}>
        <LazyComponent {...props} />
      </div>
    );
  };

  return PreloadWrapper;
}

// Intelligent intersection observer for component loading
export function useIntersectionLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin: "50px", // Start loading before fully visible
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
}

// Heavy component lazy loading with size optimization
// Commented out until components are created
/*
export const LazyThreeScene = createOptimizedLazyComponent(
  () => import('@/components/three/OptimizedScene'),
  {
    fallback: (
      <div className="flex items-center justify-center h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading 3D Scene...</p>
        </div>
      </div>
    ),
    preload: true,
    ssr: false,
  }
);

export const LazyVideoPlayer = createOptimizedLazyComponent(
  () => import('@/components/media/OptimizedVideoPlayer'),
  {
    fallback: (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading Video Player...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const LazyLottieAnimation = createOptimizedLazyComponent(
  () => import('@/components/animations/LottiePlayer'),
  {
    fallback: <div className="w-full h-48 bg-gradient-to-r from-pink-50 to-blue-50 rounded animate-pulse" />,
    preload: false, // Load only when needed
    ssr: false,
  }
);
*/

// Performance monitoring for lazy loaded components
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: ComponentType<T>,
  componentName: string,
) {
  return function PerformanceTrackedComponent(props: T) {
    useEffect(() => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Track component load time
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
        }

        // Send to analytics in production
        if (
          process.env.NODE_ENV === "production" &&
          typeof window !== "undefined"
        ) {
          // gtag might not be available
          // @ts-ignore
          window.gtag?.("event", "component_load_time", {
            component_name: componentName,
            load_time: Math.round(loadTime),
          });
        }
      };
    }, []);

    return <Component {...props} />;
  };
}

// Resource hints for better loading performance
export function useResourceHints() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Preload critical resources
    const criticalResources = [
      "/fonts/geist-variable.woff2",
      "/fonts/geist-mono-variable.woff2",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.includes(".woff") ? "font" : "image";
      if (resource.includes(".woff")) {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const externalDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://images.unsplash.com",
    ];

    externalDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
}
