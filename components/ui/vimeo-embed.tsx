"use client";

import { cn } from "@/lib/utils";

interface VimeoEmbedProps {
  videoId: string;
  className?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  responsive?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

export function VimeoEmbed({
  videoId,
  className,
  title = "Vimeo video player",
  autoplay = false,
  loop = false,
  muted = false,
  responsive = true,
  aspectRatio = "16/9",
}: VimeoEmbedProps) {
  // Build Vimeo embed URL with parameters
  const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);

  // Add query parameters
  if (autoplay) embedUrl.searchParams.set("autoplay", "1");
  if (loop) embedUrl.searchParams.set("loop", "1");
  if (muted) embedUrl.searchParams.set("muted", "1");

  // Standard Vimeo player parameters for better UX
  embedUrl.searchParams.set("badge", "0");
  embedUrl.searchParams.set("autopause", "0");
  embedUrl.searchParams.set("player_id", "0");
  embedUrl.searchParams.set("app_id", "58479");

  // Responsive wrapper styles
  const aspectRatioStyles = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  };

  if (responsive) {
    return (
      <div className={cn("w-full", aspectRatioStyles[aspectRatio], className)}>
        <iframe
          src={embedUrl.toString()}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          title={title}
          className="h-full w-full rounded-lg"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl.toString()}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
      allowFullScreen
      title={title}
      className={cn("rounded-lg", className)}
      loading="lazy"
    />
  );
}

// Utility function to extract video ID from Vimeo URL
export function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/\w+\/(\d+)/,
    /vimeo\.com\/groups\/\w+\/videos\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Utility function to check if URL is a Vimeo URL
export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url) || /player\.vimeo\.com/.test(url);
}
