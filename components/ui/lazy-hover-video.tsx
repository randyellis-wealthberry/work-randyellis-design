"use client";

import { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";

// Lazy load the heavy HoverVideo component
const HoverVideo = lazy(() =>
  import("./hover-video")
    .then((module) => {
      // Ensure we have a valid module with HoverVideo export
      if (module && module.HoverVideo) {
        return { default: module.HoverVideo };
      }
      // Fallback component if import fails
      return {
        default: () => (
          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-zinc-500">Failed to load video</span>
          </div>
        ),
      };
    })
    .catch(() => ({
      default: () => (
        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
          <span className="text-zinc-500">Failed to load video</span>
        </div>
      ),
    })),
);

interface LazyHoverVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  showControls?: boolean;
  resetOnLeave?: boolean;
  projectName?: string;
}

function VideoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg",
        className,
      )}
      role="status"
      aria-label="Loading video"
    >
      <div className="flex items-center justify-center h-full">
        <div
          className="w-12 h-12 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function LazyHoverVideo(props: LazyHoverVideoProps) {
  return (
    <Suspense fallback={<VideoSkeleton className={props.className} />}>
      <HoverVideo {...props} />
    </Suspense>
  );
}
