/**
 * Optimized WebGL component loader with progressive enhancement and fallbacks
 */
"use client";

import { useState, useEffect, useRef, Suspense, lazy, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useOptimizedLazyLoading } from "@/lib/hooks/use-optimized-lazy-loading";
import { OptimizedLazyVideo } from "./optimized-lazy-video";

// Dynamically import WebGL components
const AnimatedWebGL = lazy(() => 
  import("./animated-webgl").then(m => ({ default: m.AnimatedWebGL }))
);

interface OptimizedWebGLLoaderProps {
  sceneType: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: 'high' | 'medium' | 'low';
  enableWebGLFallback?: boolean;
  onWebGLError?: (error: Error) => void;
  // WebGL-specific props
  color?: string;
  speed?: number;
  intensity?: number;
}

export const OptimizedWebGLLoader = forwardRef<HTMLDivElement, OptimizedWebGLLoaderProps>(({
  sceneType,
  fallbackSrc,
  className,
  containerClassName,
  priority = 'medium',
  enableWebGLFallback = true,
  onWebGLError,
  color,
  speed = 1,
  intensity = 1,
}, ref) => {
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
    shouldShowSkeleton
  } = useOptimizedLazyLoading({
    preloadDistance: 400, // Larger distance for heavy 3D content
    priority,
    connectionAware: true,
    enablePreloading: true
  });

  // Check WebGL support
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          setWebglSupported(false);
          return;
        }

        // Check for software rendering (poor performance)
        const webglContext = gl as WebGLRenderingContext;
        const renderer = webglContext.getParameter(webglContext.RENDERER);
        const isSoftwareRenderer = /software|mesa|swiftshader/i.test(renderer);
        
        // Check for mobile devices with limited GPU
        const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);
        const hasLimitedGPU = isMobile && navigator.hardwareConcurrency < 4;

        // Disable WebGL on slow connections for heavy scenes
        const isSlowConnection = connectionInfo.effectiveType === '2g' || 
                               connectionInfo.effectiveType === 'slow-2g' ||
                               connectionInfo.saveData;

        setWebglSupported(!isSoftwareRenderer && !hasLimitedGPU && !isSlowConnection);
      } catch (error) {
        console.warn('WebGL detection failed:', error);
        setWebglSupported(false);
      }
    };

    checkWebGLSupport();
  }, [connectionInfo]);

  // Handle WebGL errors
  const handleWebGLError = (error: any) => {
    console.error('WebGL component error:', error);
    const webglErr = new Error(`WebGL scene failed: ${error.message || 'Unknown error'}`);
    setWebglError(webglErr);
    setForceVideoFallback(true);
    onWebGLError?.(webglErr);
  };

  // Determine what to render based on capabilities and preferences
  const shouldRenderWebGL = webglSupported && 
                           !webglError && 
                           !forceVideoFallback && 
                           shouldLoad && 
                           enableWebGLFallback;

  const shouldRenderVideo = fallbackSrc && 
                          (!webglSupported || webglError || forceVideoFallback || !enableWebGLFallback);

  // Render loading skeleton
  const renderSkeleton = () => (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-br from-muted/20 via-muted/10 to-muted/5 rounded aspect-video flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {/* 3D cube loading icon */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-muted-foreground/20 rounded transform rotate-45 animate-spin" />
          <div className="absolute inset-2 border border-muted-foreground/40 rounded transform -rotate-45" />
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {webglSupported === null ? 'Checking WebGL support...' :
             webglSupported ? 'Loading 3D scene...' : 'Loading fallback...'}
          </div>
          
          {connectionInfo.effectiveType !== '4g' && (
            <div className="text-xs text-muted-foreground/70 mt-1">
              Optimizing for {connectionInfo.effectiveType.toUpperCase()} connection
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
        "flex items-center justify-center bg-muted/5 text-muted-foreground rounded border border-dashed border-muted/30 aspect-video",
        className
      )}
    >
      <div className="text-center p-6">
        <div className="text-sm font-medium">3D content not available</div>
        <div className="text-xs opacity-70 mt-1">
          {webglError ? 'WebGL error occurred' : 'WebGL not supported'}
        </div>
        {fallbackSrc && (
          <button
            onClick={() => setForceVideoFallback(true)}
            className="text-xs text-primary underline mt-2 hover:no-underline"
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
          if (typeof ref === 'function') {
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
            sceneType={sceneType as any}
            fallbackSrc={fallbackSrc}
            className={className}
            color={color}
            speed={loadingStrategy.aggressivePreload ? speed : speed * 0.7} // Reduce speed on slower devices
            intensity={loadingStrategy.aggressivePreload ? intensity : intensity * 0.8}
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
          autoPlay={connectionInfo.effectiveType === '4g'}
          loop={true}
          muted={true}
          playsInline={true}
          onLoad={() => setComponentLoaded(true)}
        />
      )}
      
      {/* Render unsupported state */}
      {!shouldRenderWebGL && !shouldRenderVideo && webglSupported === false && renderUnsupported()}
    </div>
  );
});

OptimizedWebGLLoader.displayName = "OptimizedWebGLLoader";