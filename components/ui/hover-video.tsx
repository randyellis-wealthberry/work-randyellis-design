"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { trackProjectVideoPlay } from "@/lib/analytics";

interface HoverVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  showControls?: boolean;
  resetOnLeave?: boolean;
  projectName?: string;
}

export function HoverVideo({
  src,
  poster,
  alt,
  className,
  showControls = true,
  resetOnLeave = true,
  projectName,
}: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability and hover support
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

      setIsMobile(hasTouch && (hasNoHover || hasCoarsePointer));
    };

    checkMobile();

    // Listen for orientation changes that might affect mobile detection
    window.addEventListener("orientationchange", checkMobile);
    return () => window.removeEventListener("orientationchange", checkMobile);
  }, []);

  // Intersection Observer for mobile auto-play
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting) {
          // Auto-play on mobile when in view
          videoRef.current
            ?.play()
            .then(() => {
              if (projectName) {
                trackProjectVideoPlay(projectName, "mobile_autoplay");
              }
            })
            .catch((error) => {
              console.warn("Mobile auto-play failed:", error);
            });
        } else {
          // Pause when out of view
          videoRef.current?.pause();
          if (resetOnLeave) {
            videoRef.current!.currentTime = 0;
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px", // Slightly delay auto-play until more in view
      },
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isMobile, projectName, resetOnLeave]);

  const handleMouseEnter = async () => {
    // Only handle hover on desktop devices
    if (isMobile) return;

    setIsHovered(true);
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        // Track video play event
        if (projectName) {
          trackProjectVideoPlay(projectName, "hover_play");
        }
      } catch (error) {
        console.warn("Video play failed:", error);
      }
    }
  };

  const handleMouseLeave = () => {
    // Only handle hover on desktop devices
    if (isMobile) return;

    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      if (resetOnLeave) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div
      className={cn("relative overflow-hidden group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
        style={{ pointerEvents: "none" }}
      >
        <source src={src} type="video/mp4" />
        {alt && <p>Your browser does not support the video tag. {alt}</p>}
      </video>

      {showControls && (
        <>
          {/* Hover/Play indicator */}
          <div
            className={cn(
              "absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded transition-opacity duration-200",
              (isMobile ? isInView : isHovered) ? "opacity-100" : "opacity-0",
            )}
          >
            {isMobile ? "Auto-playing" : "Hover to play"}
          </div>
        </>
      )}
    </div>
  );
}
