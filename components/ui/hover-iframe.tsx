"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverIframeProps {
  src: string;
  title?: string;
  className?: string;
  showPlayButton?: boolean;
}

export function HoverIframe({
  src,
  title,
  className,
  showPlayButton = true,
}: HoverIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (iframeRef.current && !hasStartedPlaying) {
      // For Vimeo embeds, we can try to send a play message
      try {
        const iframe = iframeRef.current;
        if (iframe.contentWindow && src.includes("vimeo.com")) {
          iframe.contentWindow.postMessage('{"method":"play"}', "*");
          setHasStartedPlaying(true);
        }
      } catch (error) {
        // Silently handle cross-origin errors
        console.debug("Could not control video playback:", error);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (iframeRef.current && hasStartedPlaying) {
      try {
        const iframe = iframeRef.current;
        if (iframe.contentWindow && src.includes("vimeo.com")) {
          iframe.contentWindow.postMessage('{"method":"pause"}', "*");
        }
      } catch (error) {
        console.debug("Could not control video playback:", error);
      }
    }
  };

  const handlePlayClick = () => {
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        if (iframe.contentWindow && src.includes("vimeo.com")) {
          iframe.contentWindow.postMessage('{"method":"play"}', "*");
          setHasStartedPlaying(true);
        }
      } catch (error) {
        console.debug("Could not control video playback:", error);
      }
    }
  };

  return (
    <div
      className={cn("relative overflow-hidden group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        frameBorder="0"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />

      {showPlayButton && !hasStartedPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-0 transition-opacity duration-200">
          <button
            onClick={handlePlayClick}
            className="flex items-center justify-center w-16 h-16 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Play video"
          >
            <Play className="w-6 h-6 text-zinc-900 ml-1" />
          </button>
        </div>
      )}

      {/* Hover indicator */}
      <div
        className={cn(
          "absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        Hover to play
      </div>
    </div>
  );
}
