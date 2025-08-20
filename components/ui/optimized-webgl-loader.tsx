/**
 * Optimized WebGL component loader with progressive enhancement and fallbacks
 */
"use client";

import { useState, useEffect, Suspense, lazy, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useOptimizedLazyLoading } from "@/lib/hooks/use-optimized-lazy-loading";
import { OptimizedLazyVideo } from "./optimized-lazy-video";
import type { SceneType } from "./webgl-scenes/scene-factory";

// Dynamically import WebGL components
const AnimatedWebGL = lazy(() =>
  import("./animated-webgl").then((m) => ({ default: m.AnimatedWebGL })),
);

interface OptimizedWebGLLoaderProps {
  sceneType: SceneType;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: "high" | "medium" | "low";
  enableWebGLFallback?: boolean;
  onWebGLError?: (error: Error) => void;
  // WebGL-specific props
  color?: string;
  speed?: number;
  intensity?: number;
}

export const OptimizedWebGLLoader = forwardRef<
  HTMLDivElement,
  OptimizedWebGLLoaderProps
>(
  (
    {
      sceneType,
      fallbackSrc,
      className,
      containerClassName,
      priority = "medium",
      enableWebGLFallback = true,
      onWebGLError,
      color,
      speed = 1,
      intensity = 1,
    },
    ref,
  ) => {
    const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
    const [webglError, setWebglError] = useState<Error | null>(null);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [forceVideoFallback, setForceVideoFallback] = useState(false);

    const {
      elementRef,
      isInView,
      shouldPreload,
      connectionInfo,
      loadingStrategy,
      shouldLoad,
      shouldShowSkeleton,
    } = useOptimizedLazyLoading({
      preloadDistance: 400, // Larger distance for heavy 3D content
      priority,
      connectionAware: true,
      enablePreloading: true,
    });

    // Performance monitoring (use unused variables for debugging)
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        console.debug(`WebGL loader state:`, {
          isInView,
          shouldPreload,
          webglSupported,
          shouldLoad,
        });
      }
    }, [isInView, shouldPreload, webglSupported, shouldLoad]);

    // Check WebGL support
    useEffect(() => {
      const checkWebGLSupport = () => {
        try {
          const canvas = document.createElement("canvas");
          const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");

          if (!gl) {
            setWebglSupported(false);
            return;
          }

          // Check for software rendering (poor performance)
          const webglContext = gl as WebGLRenderingContext;
          const renderer = webglContext.getParameter(webglContext.RENDERER);
          const isSoftwareRenderer = /software|mesa|swiftshader/i.test(
            renderer,
          );

          // Check for mobile devices with limited GPU
          const isMobile = /android|iphone|ipad|mobile/i.test(
            navigator.userAgent,
          );
          const hasLimitedGPU = isMobile && navigator.hardwareConcurrency < 4;

          // Disable WebGL on slow connections for heavy scenes
          const isSlowConnection =
            connectionInfo.effectiveType === "2g" ||
            connectionInfo.effectiveType === "slow-2g" ||
            connectionInfo.saveData;

          setWebglSupported(
            !isSoftwareRenderer && !hasLimitedGPU && !isSlowConnection,
          );
        } catch (error) {
          console.warn("WebGL detection failed:", error);
          setWebglSupported(false);
        }
      };

      checkWebGLSupport();
    }, [connectionInfo]);

    // Handle WebGL errors
    const handleWebGLError = (error: Error) => {
      console.error("WebGL component error:", error);
      const webglErr = new Error(
        `WebGL scene failed: ${error.message || "Unknown error"}`,
      );
      setWebglError(webglErr);
      setForceVideoFallback(true);
      onWebGLError?.(webglErr);
    };

    // Determine what to render based on capabilities and preferences
    const shouldRenderWebGL =
      webglSupported &&
      !webglError &&
      !forceVideoFallback &&
      shouldLoad &&
      enableWebGLFallback;

    const shouldRenderVideo =
      fallbackSrc &&
      (!webglSupported ||
        webglError ||
        forceVideoFallback ||
        !enableWebGLFallback);

    // Render loading skeleton
    const renderSkeleton = () => (
      <div
        className={cn(
          "from-muted/20 via-muted/10 to-muted/5 flex aspect-video animate-pulse items-center justify-center rounded bg-gradient-to-br",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-3">
          {/* 3D cube loading icon */}
          <div className="relative h-12 w-12">
            <div className="border-muted-foreground/20 absolute inset-0 rotate-45 transform animate-spin rounded border-2" />
            <div className="border-muted-foreground/40 absolute inset-2 -rotate-45 transform rounded border" />
          </div>

          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              {webglSupported === null
                ? "Checking WebGL support..."
                : webglSupported
                  ? "Loading 3D scene..."
                  : "Loading fallback..."}
            </div>

            {connectionInfo.effectiveType !== "4g" && (
              <div className="text-muted-foreground/70 mt-1 text-xs">
                Optimizing for {connectionInfo.effectiveType.toUpperCase()}{" "}
                connection
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // Render WebGL not supported message
    const renderUnsupported = () => (
      <div
        className={cn(
          "bg-muted/5 text-muted-foreground border-muted/30 flex aspect-video items-center justify-center rounded border border-dashed",
          className,
        )}
      >
        <div className="p-6 text-center">
          <div className="text-sm font-medium">3D content not available</div>
          <div className="mt-1 text-xs opacity-70">
            {webglError ? "WebGL error occurred" : "WebGL not supported"}
          </div>
          {fallbackSrc && (
            <button
              onClick={() => setForceVideoFallback(true)}
              className="text-primary mt-2 text-xs underline hover:no-underline"
            >
              Show video instead
            </button>
          )}
        </div>
      </div>
    );

    return (
      <div
        ref={(node) => {
          // Assign to both refs
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          elementRef.current = node;
        }}
        className={cn("relative", containerClassName)}
      >
        {/* Show skeleton while determining what to load */}
        {shouldShowSkeleton && !componentLoaded && renderSkeleton()}

        {/* Render WebGL scene */}
        {shouldRenderWebGL && (
          <Suspense fallback={renderSkeleton()}>
            <AnimatedWebGL
              sceneType={sceneType}
              fallbackSrc={fallbackSrc}
              className={className}
              color={color}
              speed={loadingStrategy.aggressivePreload ? speed : speed * 0.7} // Reduce speed on slower devices
              intensity={
                loadingStrategy.aggressivePreload ? intensity : intensity * 0.8
              }
              onError={handleWebGLError}
            />
          </Suspense>
        )}

        {/* Render video fallback */}
        {shouldRenderVideo && (
          <OptimizedLazyVideo
            src={fallbackSrc!}
            className={className}
            priority={priority}
            autoPlay={connectionInfo.effectiveType === "4g"}
            loop={true}
            muted={true}
            playsInline={true}
            onLoad={() => setComponentLoaded(true)}
          />
        )}

        {/* Render unsupported state */}
        {!shouldRenderWebGL &&
          !shouldRenderVideo &&
          webglSupported === false &&
          renderUnsupported()}
      </div>
    );
  },
);

OptimizedWebGLLoader.displayName = "OptimizedWebGLLoader";
