"use client";

import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { AnimatedAsset } from "./animated-asset";
import { UnicornWebGL } from "./unicorn-webgl";
import { WebGLSceneFactory, type SceneType } from "./webgl-scenes";
import { useWebGLRenderer } from "@/hooks/useWebGLRenderer";

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
}: AnimatedWebGLProps) => {
  const {
    containerRef,
    capabilities,
    hasError,
    isInView,
    shouldRenderWebGL,
    shouldUseLowQuality,
    handleError,
  } = useWebGLRenderer();

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
          <UnicornWebGL />
        </AnimatedAsset>
      </div>
    );
  }

  // Fallback to video if WebGL not supported or has error
  if (!shouldRenderWebGL || !capabilities?.hasWebGL) {
    if (!fallbackSrc) {
      return (
        <div className={cn("aspect-video w-full h-full bg-muted/50 flex items-center justify-center", className)}>
          <p className="text-muted-foreground text-sm">WebGL not supported</p>
        </div>
      );
    }

    if (disableZoom) {
      return (
        <div ref={containerRef} className={cn("aspect-video", containerClassName)}>
          <video
            src={fallbackSrc}
            autoPlay
            loop
            muted
            playsInline
            className={cn("aspect-video w-full h-full object-cover", className)}
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
            className="aspect-video w-full h-full object-cover"
          />
        </AnimatedAsset>
      </div>
    );
  }

  // WebGL content with performance optimizations
  const webglContent = (
    <div className={cn("aspect-video w-full h-full", className)}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        dpr={shouldUseLowQuality ? 1 : Math.min(2, window?.devicePixelRatio || 1)}
        performance={{ min: shouldUseLowQuality ? 0.2 : 0.5 }}
        onError={handleError}
        gl={{
          antialias: !shouldUseLowQuality,
          alpha: true,
          powerPreference: shouldUseLowQuality ? "low-power" : "default",
        }}
      >
        <Suspense fallback={null}>
          <WebGLSceneFactory
            type={sceneType}
            color={color}
            speed={speed}
            intensity={shouldUseLowQuality ? intensity * 0.5 : intensity}
          />
        </Suspense>
      </Canvas>
    </div>
  );

  if (disableZoom) {
    return (
      <div ref={containerRef} className={containerClassName}>
        {webglContent}
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
        {webglContent}
      </AnimatedAsset>
    </div>
  );
};