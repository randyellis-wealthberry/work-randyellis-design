"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HoverIframeProps {
  src: string;
  title?: string;
  className?: string;
}

export function HoverIframe({ src, title, className }: HoverIframeProps) {
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

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
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

      {/* Hover indicator */}
      <div
        className={cn(
          "absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        Hover to play
      </div>
    </div>
  );
}
