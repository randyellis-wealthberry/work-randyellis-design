"use client";

import { lazy, Suspense, ComponentType } from "react";
import { cn } from "@/lib/utils";

// Lazy load heavy WebGL components
const AnimatedWebGL = lazy(() => 
  import("@/components/ui/animated-webgl").then(module => ({
    default: module.AnimatedWebGL
  }))
);

const UnicornWebGL = lazy(() => 
  import("@/components/ui/unicorn-webgl").then(module => ({
    default: module.UnicornWebGL
  }))
);

const DelightParticles = lazy(() => 
  import("@/components/ui/delight-particles").then(module => ({
    default: module.DelightParticles
  }))
);

// Loading fallback component
const WebGLLoader = ({ className }: { className?: string }) => (
  <div className={cn("aspect-video w-full h-full bg-muted/20 animate-pulse flex items-center justify-center", className)}>
    <div className="space-y-2 text-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground">Loading 3D content...</p>
    </div>
  </div>
);

// Wrapper components with lazy loading
export const LazyAnimatedWebGL = (props: any) => (
  <Suspense fallback={<WebGLLoader className={props.className} />}>
    <AnimatedWebGL {...props} />
  </Suspense>
);

export const LazyUnicornWebGL = (props: any) => (
  <Suspense fallback={<WebGLLoader />}>
    <UnicornWebGL {...props} />
  </Suspense>
);

export const LazyDelightParticles = (props: any) => (
  <Suspense fallback={<div className="w-full h-full" />}>
    <DelightParticles {...props} />
  </Suspense>
);

// Generic lazy wrapper for any heavy component
export function createLazyComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => (
    <Suspense fallback={fallback || <WebGLLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}