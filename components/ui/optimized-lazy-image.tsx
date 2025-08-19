/**
 * Optimized lazy image component with aggressive preloading and performance optimizations
 */
"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useOptimizedLazyLoading } from "@/lib/hooks/use-optimized-lazy-loading";

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: "high" | "medium" | "low";
  placeholder?: "blur" | "empty" | "skeleton";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  // Performance options
  preloadDistance?: number;
  enableWebP?: boolean;
  enableProgressiveLoading?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const OptimizedLazyImage = forwardRef<
  HTMLDivElement,
  OptimizedLazyImageProps
>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      containerClassName,
      priority = "medium",
      placeholder = "skeleton",
      blurDataURL,
      sizes,
      quality = 85,
      fill = false,
      preloadDistance = 300,
      enableWebP = true,
      enableProgressiveLoading = true,
      onLoad,
      onError,
    },
    ref,
  ) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState<Error | null>(null);
    const [loadStarted, setLoadStarted] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

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

    // Optimize image format based on browser support
    const optimizedSrc =
      enableWebP && typeof window !== "undefined"
        ? src.replace(/\.(jpg|jpeg|png)$/i, ".webp")
        : src;

    // Progressive quality based on connection
    const adaptiveQuality =
      connectionInfo.effectiveType === "4g"
        ? quality
        : connectionInfo.effectiveType === "3g"
          ? Math.max(60, quality - 20)
          : Math.max(40, quality - 40);

    // Prefetch image when appropriate
    useEffect(() => {
      if (shouldPreload && loadingStrategy.aggressivePreload) {
        prefetchResource(optimizedSrc, "image");
      }
    }, [
      shouldPreload,
      loadingStrategy.aggressivePreload,
      prefetchResource,
      optimizedSrc,
    ]);

    // Start loading when needed
    useEffect(() => {
      if (shouldLoad && canStartLoading && !loadStarted) {
        setLoadStarted(true);
      }
    }, [shouldLoad, canStartLoading, loadStarted]);

    const handleImageLoad = () => {
      setImageLoaded(true);
      onLoad?.();
    };

    const handleImageError = (error: any) => {
      const err = new Error(`Failed to load image: ${src}`);
      setImageError(err);
      onError?.(err);
    };

    // Generate skeleton dimensions
    const skeletonStyle = {
      width: width || "100%",
      height: height || "auto",
      aspectRatio: width && height ? `${width}/${height}` : undefined,
    };

    // Render skeleton
    const renderSkeleton = () => {
      if (placeholder === "empty") return null;

      if (placeholder === "skeleton") {
        return (
          <div
            className={cn(
              "bg-muted/20 animate-pulse rounded",
              fill && "absolute inset-0",
              className,
            )}
            style={skeletonStyle}
          >
            {enableProgressiveLoading && loadingProgress > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground text-xs">
                  {Math.round(loadingProgress)}%
                </div>
              </div>
            )}
          </div>
        );
      }

      return null;
    };

    // Render error state
    const renderError = () => (
      <div
        className={cn(
          "bg-muted/10 text-muted-foreground border-muted/20 flex items-center justify-center rounded border-2 border-dashed",
          fill && "absolute inset-0",
          className,
        )}
        style={skeletonStyle}
      >
        <div className="p-4 text-center">
          <div className="text-sm">Failed to load image</div>
          <div className="mt-1 text-xs opacity-70">{alt}</div>
        </div>
      </div>
    );

    if (imageError) {
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
        className={cn(fill && "relative", containerClassName)}
      >
        {/* Show skeleton while loading */}
        {shouldShowSkeleton && !imageLoaded && renderSkeleton()}

        {/* Load image when appropriate */}
        {loadStarted && (
          <Image
            ref={imageRef}
            src={optimizedSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes}
            quality={adaptiveQuality}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            priority={priority === "high"}
            className={cn(
              "transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0",
              className,
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
      </div>
    );
  },
);

OptimizedLazyImage.displayName = "OptimizedLazyImage";
