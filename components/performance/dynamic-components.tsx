"use client";

import { lazy, Suspense, ComponentType } from "react";
import { cn } from "@/lib/utils";

// Aggressive dynamic imports for heavy components
export const DynamicAnimatedWebGL = lazy(() =>
  import(
    /* webpackChunkName: "webgl-animated" */
    "@/components/ui/animated-webgl"
  ).then((module) => ({ default: module.AnimatedWebGL })),
);

export const DynamicCanvas = lazy(() =>
  import(
    /* webpackChunkName: "threejs-canvas" */
    "@react-three/fiber"
  ).then((module) => ({ default: module.Canvas })),
);

export const DynamicFramerMotion = lazy(() =>
  import(
    /* webpackChunkName: "framer-motion" */
    "framer-motion"
  ).then((module) => ({
    default: module.motion.div,
    motion: module.motion,
    AnimatePresence: module.AnimatePresence,
    useAnimation: module.useAnimation,
    useInView: module.useInView,
  })),
);

// Heavy UI components
export const DynamicTestimonialCarousel = lazy(() =>
  import(
    /* webpackChunkName: "ui-carousel" */
    "@/components/ui/testimonial-carousel"
  ).then((module) => ({ default: module.TestimonialCarousel })),
);

export const DynamicVideoPlayer = lazy(() =>
  import(
    /* webpackChunkName: "ui-video" */
    "@/components/ui/video-player"
  ).then((module) => ({ default: module.VideoPlayer })),
);

export const DynamicDelightParticles = lazy(() =>
  import(
    /* webpackChunkName: "ui-particles" */
    "@/components/ui/delight-particles"
  ).then((module) => ({ default: module.DelightParticles })),
);

// Three.js scene components
export const DynamicOrganicScene = lazy(() =>
  import(
    /* webpackChunkName: "threejs-organic" */
    "@/components/ui/webgl-scenes/organic-scene"
  ).then((module) => ({ default: module.OrganicScene })),
);

export const DynamicNeuralScene = lazy(() =>
  import(
    /* webpackChunkName: "threejs-neural" */
    "@/components/ui/webgl-scenes/neural-scene"
  ).then((module) => ({ default: module.NeuralScene })),
);

export const DynamicGeometricScene = lazy(() =>
  import(
    /* webpackChunkName: "threejs-geometric" */
    "@/components/ui/webgl-scenes/geometric-scene"
  ).then((module) => ({ default: module.GeometricScene })),
);

// Loading fallbacks
const ComponentLoader = ({
  className,
  type = "default",
}: {
  className?: string;
  type?: "default" | "webgl" | "video" | "carousel";
}) => {
  const getMessage = () => {
    switch (type) {
      case "webgl":
        return "Loading 3D content...";
      case "video":
        return "Loading video player...";
      case "carousel":
        return "Loading carousel...";
      default:
        return "Loading...";
    }
  };

  return (
    <div
      className={cn(
        "bg-muted/10 flex h-full w-full items-center justify-center",
        type === "webgl" && "aspect-video",
        className,
      )}
    >
      <div className="space-y-2 text-center">
        <div className="border-primary mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground text-sm">{getMessage()}</p>
      </div>
    </div>
  );
};

// Wrapper components with proper fallbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyAnimatedWebGL = (props: any) => (
  <Suspense
    fallback={<ComponentLoader type="webgl" className={props.className} />}
  >
    <DynamicAnimatedWebGL {...props} />
  </Suspense>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyTestimonialCarousel = (props: any) => (
  <Suspense
    fallback={<ComponentLoader type="carousel" className={props.className} />}
  >
    <DynamicTestimonialCarousel {...props} />
  </Suspense>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyVideoPlayer = (props: any) => (
  <Suspense
    fallback={<ComponentLoader type="video" className={props.className} />}
  >
    <DynamicVideoPlayer {...props} />
  </Suspense>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LazyDelightParticles = (props: any) => (
  <Suspense fallback={<div className="h-full w-full" />}>
    <DynamicDelightParticles {...props} />
  </Suspense>
);

// Generic lazy component factory with intersection observer
export function createIntersectionLazyComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  chunkName?: string,
  fallbackType: "default" | "webgl" | "video" | "carousel" = "default",
) {
  const LazyComponent = lazy(importFn);

  const LazyWrapper = (
    props: T & { className?: string; containerClassName?: string },
  ) => {
    return (
      <Suspense
        fallback={
          <ComponentLoader type={fallbackType} className={props.className} />
        }
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  LazyWrapper.displayName = `LazyWrapper_${chunkName || "Component"}`;
  return LazyWrapper;
}
