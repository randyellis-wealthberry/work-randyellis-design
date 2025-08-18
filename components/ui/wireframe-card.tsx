"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Tilt } from "@/components/core/tilt";
import type { WireframeData } from "@/lib/data/wireframes-data";

interface WireframeCardProps {
  wireframe: WireframeData;
  animationDelay?: number;
  className?: string;
}

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
        className={`rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
      >
        <div className="text-center text-gray-500">
          <p>Wireframe data unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <Tilt className="h-full w-full">
      <motion.div
        data-testid="wireframe-card"
        data-animation-delay={animationDelay}
        aria-label={`Wireframe: ${wireframe.title}`}
        className={`group relative h-full transform overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all transition-transform duration-300 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 ${className} `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: animationDelay / 1000,
          ease: "easeOut",
        }}
        tabIndex={0}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
          {imageLoading && (
            <div
              data-testid="image-loading-skeleton"
              className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              </div>
            </div>
          )}

          {imageError ? (
            <div
              data-testid="image-error-state"
              className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800"
            >
              <p className="mb-2 text-sm text-gray-500">Failed to load image</p>
              <button
                onClick={handleRetry}
                className="rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
              >
                Retry
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
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div
              data-testid="placeholder-image"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
            >
              <div className="text-center text-gray-400 dark:text-gray-500">
                <div className="mx-auto mb-2 h-12 w-12 opacity-50">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <h3 className="text-sm leading-tight font-semibold text-gray-900 dark:text-white">
            {wireframe.title}
          </h3>

          {wireframe.features && wireframe.features.length > 0 && (
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {wireframe.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-blue-500" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </Tilt>
  );
}
