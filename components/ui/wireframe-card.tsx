"use client";

import { useState } from "react";
import Image from "next/image";
import type { WireframeData } from "@/lib/data/wireframes-data";

interface WireframeCardProps {
  wireframe: WireframeData;
  animationDelay?: number;
  className?: string;
}

/**
 * One wireframe as a figure: the screen, what it is, and what it carries. The
 * frame is a hairline and a ground tint — no card, no lift, no tilt, because
 * the screen inside it is the thing being looked at.
 */
export function WireframeCard({
  wireframe,
  animationDelay = 0,
  className = "",
}: WireframeCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleRetry = () => {
    setImageLoading(true);
    setImageError(false);
    setRetryKey((prev) => prev + 1);
  };

  if (!wireframe.title && !wireframe.id) {
    // Handle malformed data
    return (
      <div
        data-testid="wireframe-card"
        data-animation-delay={animationDelay}
        aria-label="Wireframe card with missing data"
        className={`border-t border-zinc-200 py-5 dark:border-zinc-800 ${className}`}
      >
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Wireframe data unavailable
        </p>
      </div>
    );
  }

  return (
    <figure
      data-testid="wireframe-card"
      data-animation-delay={animationDelay}
      aria-label={`Wireframe: ${wireframe.title}`}
      className={className}
    >
      {/* These are tall phone screens. Contained on a tinted ground rather than
          cropped to a landscape box — a wireframe sliced through the middle is
          not evidence of anything. */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {imageLoading && !imageError && (
          <div
            data-testid="image-loading-skeleton"
            className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
          />
        )}

        {imageError ? (
          <div
            data-testid="image-error-state"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This screen didn&rsquo;t load.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-[44px] cursor-pointer text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
            >
              Try loading it again
            </button>
          </div>
        ) : wireframe.imagePath ? (
          <Image
            key={`${wireframe.id}-${retryKey}-retry`}
            data-retry-key={retryKey}
            data-testid="wireframe-image"
            data-original-src={wireframe.imagePath}
            src={wireframe.imagePath}
            alt={wireframe.altText}
            fill
            loading="lazy"
            className="object-contain p-4"
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div
            data-testid="placeholder-image"
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No image for this screen
            </p>
          </div>
        )}
      </div>

      <figcaption className="mt-4">
        <h3 className="text-base font-medium text-zinc-900 dark:text-white">
          {wireframe.title}
        </h3>

        {wireframe.features && wireframe.features.length > 0 && (
          <ul className="mt-3">
            {wireframe.features.map((feature) => (
              <li
                key={feature}
                className="border-t border-zinc-200 py-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                {feature}
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}
