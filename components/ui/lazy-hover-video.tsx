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
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <span className="text-zinc-500">Failed to load video</span>
          </div>
        ),
      };
    })
    .catch(() => ({
      default: () => (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
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
        "h-full w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800",
        className,
      )}
      role="status"
      aria-label="Loading video"
    >
      <div className="flex h-full items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"
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
