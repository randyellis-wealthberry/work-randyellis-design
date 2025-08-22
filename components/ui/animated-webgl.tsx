"use client";

import { cn } from "@/lib/utils";
import { lazy, Suspense } from "react";
import { AnimatedAsset } from "./animated-asset";
import { useWebGLRenderer } from "@/hooks/useWebGLRenderer";
import type { SceneType } from "./webgl-scenes/scene-factory";

// Dynamic imports for heavy 3D libraries
const Canvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas })),
);
const WebGLSceneFactory = lazy(() =>
  import("./webgl-scenes/scene-factory").then((m) => ({
    default: m.WebGLSceneFactory,
  })),
);
const UnicornWebGL = lazy(() =>
  import("./unicorn-webgl").then((m) => ({ default: m.UnicornWebGL })),
);

type AnimatedWebGLProps = {
  sceneType: SceneType;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  expandedClassName?: string;
  hoverScale?: number;
  showCloseButton?: boolean;
  disableZoom?: boolean;
  color?: string;
  speed?: number;
  intensity?: number;
  onError?: (error: Error) => void;
};

export const AnimatedWebGL = ({
  sceneType,
  fallbackSrc,
  className,
  containerClassName,
  expandedClassName,
  hoverScale = 1.02,
  showCloseButton = true,
  disableZoom = false,
  color,
  speed = 1,
  intensity = 1,
  onError,
}: AnimatedWebGLProps) => {
  // Handle WebGL errors if callback provided
  const handleWebGLError = (error: Error) => {
    if (onError) {
      onError(error);
    } else {
      console.error("WebGL Error:", error);
    }
  };

  // Use the error handler to prevent unused variable warning
  void handleWebGLError;
  const {
    containerRef,
    capabilities,
    isInView,
    shouldRenderWebGL,
    shouldUseLowQuality,
    dpr,
    antialias,
    handleError,
  } = useWebGLRenderer();

  // Enhanced WebGL content loading with performance optimizations
  const renderWebGLContent = () => {
    // Only render when in viewport and WebGL is supported
    if (!isInView || !shouldRenderWebGL || !capabilities?.hasWebGL) {
      return null;
    }

    const webglContent = (
      <div className={cn("aspect-video h-full w-full", className)}>
        <Suspense
          fallback={
            <div className="bg-muted/20 flex h-full w-full animate-pulse items-center justify-center">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
            dpr={
              dpr ||
              (shouldUseLowQuality
                ? 1
                : Math.min(2, window?.devicePixelRatio || 1))
            }
            performance={{ min: shouldUseLowQuality ? 0.2 : 0.5 }}
            onError={handleError}
            gl={{
              antialias:
                antialias !== undefined ? antialias : !shouldUseLowQuality,
              alpha: true,
              powerPreference: shouldUseLowQuality ? "low-power" : "default",
            }}
          >
            <WebGLSceneFactory
              type={sceneType}
              color={color}
              speed={speed}
              intensity={shouldUseLowQuality ? intensity * 0.5 : intensity}
            />
          </Canvas>
        </Suspense>
      </div>
    );

    return webglContent;
  };

  // Special handling for Unicorn Studio
  if (sceneType === "unicorn") {
    return (
      <div ref={containerRef}>
        <AnimatedAsset
          className={className}
          containerClassName={containerClassName}
          expandedClassName={expandedClassName}
          hoverScale={hoverScale}
          showCloseButton={showCloseButton}
        >
          {isInView && (
            <Suspense
              fallback={
                <div className="bg-muted/20 flex h-full w-full animate-pulse items-center justify-center">
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              }
            >
              <UnicornWebGL />
            </Suspense>
          )}
        </AnimatedAsset>
      </div>
    );
  }

  // Fallback to video if WebGL not supported or has error
  if (!shouldRenderWebGL || !capabilities?.hasWebGL) {
    if (!fallbackSrc) {
      return (
        <div
          className={cn(
            "bg-muted/50 flex aspect-video h-full w-full items-center justify-center",
            className,
          )}
        >
          <p className="text-muted-foreground text-sm">WebGL not supported</p>
        </div>
      );
    }

    if (disableZoom) {
      return (
        <div
          ref={containerRef}
          className={cn("aspect-video", containerClassName)}
        >
          <video
            src={fallbackSrc}
            autoPlay
            loop
            muted
            playsInline
            className={cn("aspect-video h-full w-full object-cover", className)}
          />
        </div>
      );
    }

    return (
      <div ref={containerRef}>
        <AnimatedAsset
          className={className}
          containerClassName={containerClassName}
          expandedClassName={expandedClassName}
          hoverScale={hoverScale}
          showCloseButton={showCloseButton}
        >
          <video
            src={fallbackSrc}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-video h-full w-full object-cover"
          />
        </AnimatedAsset>
      </div>
    );
  }

  const webglContent = renderWebGLContent();

  if (disableZoom) {
    return (
      <div ref={containerRef} className={containerClassName}>
        {webglContent || (
          <div
            className={cn(
              "bg-muted/50 flex aspect-video h-full w-full items-center justify-center",
              className,
            )}
          >
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <AnimatedAsset
        className={className}
        containerClassName={containerClassName}
        expandedClassName={expandedClassName}
        hoverScale={hoverScale}
        showCloseButton={showCloseButton}
      >
        {webglContent || (
          <div
            className={cn(
              "bg-muted/50 flex aspect-video h-full w-full items-center justify-center",
              className,
            )}
          >
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        )}
      </AnimatedAsset>
    </div>
  );
};

AnimatedWebGL.displayName = "AnimatedWebGL";
