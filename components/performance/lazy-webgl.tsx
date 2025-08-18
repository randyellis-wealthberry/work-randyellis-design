"use client";

import {
  lazy,
  Suspense,
  ComponentType,
  useState,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

// Enhanced dynamic imports with better chunking
const AnimatedWebGL = lazy(() =>
  import(
    /* webpackChunkName: "webgl-core" */
    "@/components/ui/animated-webgl"
  ).then((module) => ({
    default: module.AnimatedWebGL,
  })),
);

const UnicornWebGL = lazy(() =>
  import(
    /* webpackChunkName: "unicorn-webgl" */
    "@/components/ui/unicorn-webgl"
  ).then((module) => ({
    default: module.UnicornWebGL,
  })),
);

const DelightParticles = lazy(() =>
  import(
    /* webpackChunkName: "particles" */
    "@/components/ui/delight-particles"
  ).then((module) => ({
    default: module.DelightParticles,
  })),
);

// Three.js related imports in separate chunks
const ThreeJSCore = lazy(() =>
  import(
    /* webpackChunkName: "threejs-core" */
    "@react-three/fiber"
  ).then((module) => ({
    default: module.Canvas,
  })),
);

// Note: ThreeJSDrei removed due to type complexity - will be handled differently

// Enhanced loading fallback with progressive states
const WebGLLoader = ({
  className,
  stage = "initializing",
}: {
  className?: string;
  stage?: "initializing" | "loading-webgl" | "loading-scene" | "ready";
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 20, 90));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const getMessage = () => {
    switch (stage) {
      case "loading-webgl":
        return "Loading WebGL engine...";
      case "loading-scene":
        return "Loading 3D scene...";
      case "ready":
        return "Almost ready...";
      default:
        return "Initializing...";
    }
  };

  return (
    <div
      className={cn(
        "bg-muted/20 flex aspect-video h-full w-full animate-pulse items-center justify-center",
        className,
      )}
    >
      <div className="max-w-xs space-y-3 text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">{getMessage()}</p>
          <div className="bg-muted h-1 w-full rounded-full">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced intersection observer hook
function useIntersectionObserver(threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin: "50px", // Start loading slightly before element comes into view
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

// Enhanced wrapper components with intersection observer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyAnimatedWebGL = (props: any) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.1);
  const [loadingStage, setLoadingStage] = useState<
    "initializing" | "loading-webgl" | "loading-scene" | "ready"
  >("initializing");

  useEffect(() => {
    if (hasIntersected) {
      setLoadingStage("loading-webgl");
      const timer1 = setTimeout(() => setLoadingStage("loading-scene"), 500);
      const timer2 = setTimeout(() => setLoadingStage("ready"), 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [hasIntersected]);

  return (
    <div ref={ref} className={props.containerClassName}>
      {hasIntersected ? (
        <Suspense
          fallback={
            <WebGLLoader className={props.className} stage={loadingStage} />
          }
        >
          <AnimatedWebGL {...props} />
        </Suspense>
      ) : (
        <div
          className={cn(
            "bg-muted/10 flex aspect-video h-full w-full items-center justify-center",
            props.className,
          )}
        >
          <p className="text-muted-foreground text-sm">
            Scroll to load 3D content
          </p>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyUnicornWebGL = (props: any) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.1);

  return (
    <div ref={ref}>
      {hasIntersected ? (
        <Suspense fallback={<WebGLLoader stage="loading-webgl" />}>
          <UnicornWebGL {...props} />
        </Suspense>
      ) : (
        <div className="bg-muted/10 flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Scroll to load content
          </p>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyDelightParticles = (props: any) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.2);

  return (
    <div ref={ref} className="h-full w-full">
      {hasIntersected ? (
        <Suspense fallback={<div className="h-full w-full" />}>
          <DelightParticles {...props} />
        </Suspense>
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  );
};

// Enhanced generic lazy wrapper with intersection observer
export function createLazyComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFn: () => Promise<{ default: ComponentType<any> }>,
  options: {
    fallback?: React.ReactNode;
    threshold?: number;
    chunkName?: string;
    requiresIntersection?: boolean;
  } = {},
) {
  const {
    fallback = <WebGLLoader />,
    threshold = 0.1,
    requiresIntersection = true,
  } = options;

  const LazyComponent = lazy(importFn);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LazyWrapper = (props: any) => {
    const { ref, hasIntersected } = useIntersectionObserver(threshold);

    if (!requiresIntersection) {
      return (
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      );
    }

    return (
      <div ref={ref} className={props.containerClassName}>
        {hasIntersected ? (
          <Suspense fallback={fallback}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          <div className="bg-muted/10 flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        )}
      </div>
    );
  };

  LazyWrapper.displayName = `LazyWrapper_${options.chunkName || "Component"}`;
  return LazyWrapper;
}

// Export additional optimized components
export { ThreeJSCore };

WebGLLoader.displayName = "WebGLLoader";
LazyAnimatedWebGL.displayName = "LazyAnimatedWebGL";
LazyUnicornWebGL.displayName = "LazyUnicornWebGL";
LazyDelightParticles.displayName = "LazyDelightParticles";
