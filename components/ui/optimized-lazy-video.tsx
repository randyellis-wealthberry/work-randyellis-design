/**
 * Optimized lazy video component with intelligent preloading and adaptive quality
 */
"use client";

import { useState, useEffect, useRef, forwardRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useOptimizedLazyLoading } from "@/lib/hooks/use-optimized-lazy-loading";

interface OptimizedLazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  containerClassName?: string;
  priority?: "high" | "medium" | "low";
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  // Performance options
  preloadDistance?: number;
  enableAdaptiveQuality?: boolean;
  preload?: "none" | "metadata" | "auto";
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export const OptimizedLazyVideo = forwardRef<
  HTMLDivElement,
  OptimizedLazyVideoProps
>(
  (
    {
      src,
      poster,
      className,
      containerClassName,
      priority = "medium",
      autoPlay = false,
      loop = true,
      muted = true,
      controls = false,
      playsInline = true,
      preloadDistance = 200,
      enableAdaptiveQuality = true,
      preload = "metadata",
      onLoad,
      onError,
      onPlay,
      onPause,
    },
    ref,
  ) => {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState<Error | null>(null);
    const [loadStarted, setLoadStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const {
      elementRef,
      isInView,
      shouldPreload,
      isLoaded,
      loadingProgress,
      connectionInfo,
      loadingStrategy,
      prefetchResource,
      shouldLoad,
      shouldShowSkeleton,
      canStartLoading,
    } = useOptimizedLazyLoading({
      preloadDistance,
      priority,
      connectionAware: true,
      enablePreloading: true,
    });

    // Performance monitoring (use isLoaded for debugging)
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        console.debug(`Video lazy loading state:`, {
          src,
          isInView,
          isLoaded,
          canStartLoading,
          videoLoaded,
        });
      }
    }, [isInView, isLoaded, canStartLoading, src, videoLoaded]);

    // Adaptive preload strategy based on connection
    const adaptivePreload = enableAdaptiveQuality
      ? connectionInfo.effectiveType === "4g"
        ? "metadata"
        : connectionInfo.effectiveType === "3g"
          ? "none"
          : "none"
      : preload;

    // Prefetch video when appropriate
    useEffect(() => {
      if (
        shouldPreload &&
        loadingStrategy.aggressivePreload &&
        connectionInfo.effectiveType === "4g"
      ) {
        prefetchResource(src, "video");
      }
    }, [
      shouldPreload,
      loadingStrategy.aggressivePreload,
      prefetchResource,
      src,
      connectionInfo,
    ]);

    // Start loading when needed
    useEffect(() => {
      if (shouldLoad && canStartLoading && !loadStarted) {
        setLoadStarted(true);
      }
    }, [shouldLoad, canStartLoading, loadStarted]);

    // Auto-play when in view (if enabled)
    useEffect(() => {
      if (
        videoRef.current &&
        isInView &&
        videoLoaded &&
        autoPlay &&
        !isPlaying
      ) {
        const playPromise = videoRef.current.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.warn("Auto-play prevented:", error);
          });
        }
      }
    }, [isInView, videoLoaded, autoPlay, isPlaying]);

    // Pause when out of view to save bandwidth
    useEffect(() => {
      if (videoRef.current && !isInView && isPlaying && autoPlay) {
        videoRef.current.pause();
      }
    }, [isInView, isPlaying, autoPlay]);

    const handleVideoLoad = useCallback(() => {
      setVideoLoaded(true);
      setBuffering(false);
      onLoad?.();
    }, [onLoad]);

    const handleVideoError = useCallback(() => {
      const err = new Error(`Failed to load video: ${src}`);
      setVideoError(err);
      setBuffering(false);
      onError?.(err);
    }, [src, onError]);

    const handlePlay = useCallback(() => {
      setIsPlaying(true);
      onPlay?.();
    }, [onPlay]);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
      onPause?.();
    }, [onPause]);

    const handleWaiting = useCallback(() => {
      setBuffering(true);
    }, []);

    const handleCanPlay = useCallback(() => {
      setBuffering(false);
    }, []);

    // Render skeleton/loading state
    const renderSkeleton = () => (
      <div
        className={cn(
          "bg-muted/20 flex aspect-video animate-pulse items-center justify-center rounded",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {/* Play button icon */}
          <div className="bg-muted/40 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-muted-foreground ml-1 h-8 w-8"
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

          {/* Loading progress */}
          {loadingProgress > 0 && (
            <div className="text-muted-foreground text-xs">
              Loading... {Math.round(loadingProgress)}%
            </div>
          )}

          {/* Connection indicator */}
          {connectionInfo.effectiveType !== "4g" && (
            <div className="text-muted-foreground/70 text-xs">
              {connectionInfo.effectiveType.toUpperCase()} connection
            </div>
          )}
        </div>
      </div>
    );

    // Render error state
    const renderError = () => (
      <div
        className={cn(
          "bg-destructive/5 text-destructive border-destructive/20 flex aspect-video items-center justify-center rounded border-2 border-dashed",
          className,
        )}
      >
        <div className="p-4 text-center">
          <div className="text-sm font-medium">Failed to load video</div>
          <div className="mt-1 text-xs opacity-70">
            Check your connection and try again
          </div>
        </div>
      </div>
    );

    if (videoError) {
      return (
        <div ref={ref} className={containerClassName}>
          {renderError()}
        </div>
      );
    }

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
        {/* Show skeleton while loading */}
        {shouldShowSkeleton && !videoLoaded && renderSkeleton()}

        {/* Buffering indicator */}
        {buffering && videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {/* Load video when appropriate */}
        {loadStarted && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoPlay && connectionInfo.effectiveType === "4g"} // Only autoplay on fast connections
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline={playsInline}
            preload={adaptivePreload}
            className={cn(
              "h-auto w-full rounded transition-opacity duration-300",
              videoLoaded ? "opacity-100" : "opacity-0",
              className,
            )}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onPlay={handlePlay}
            onPause={handlePause}
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  },
);

OptimizedLazyVideo.displayName = "OptimizedLazyVideo";
