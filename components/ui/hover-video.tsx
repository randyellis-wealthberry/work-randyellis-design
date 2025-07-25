"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  showControls?: boolean;
  resetOnLeave?: boolean;
}

export function HoverVideo({
  src,
  poster,
  alt,
  className,
  showControls = true,
  resetOnLeave = true,
}: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn("Video play failed:", error);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (resetOnLeave) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const togglePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Video play failed:", error);
        }
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
          {/* Play/Pause button overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200",
              isPlaying || isHovered ? "opacity-0" : "opacity-100",
            )}
          >
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-16 h-16 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-zinc-900 ml-0" />
              ) : (
                <Play className="w-6 h-6 text-zinc-900 ml-1" />
              )}
            </button>
          </div>

          {/* Hover indicator */}
          <div
            className={cn(
              "absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            Hover to play
          </div>
        </>
      )}
    </div>
  );
}
