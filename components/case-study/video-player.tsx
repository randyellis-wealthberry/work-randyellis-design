"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9}>
          {isClient ? (
            <video
              className="h-full w-full object-cover"
              controls
              poster={poster}
              preload="metadata"
              aria-label={title}
            >
              <source src={src} type="video/mp4" />
              <p>
                Your browser doesn&apos;t support HTML video.
                <a href={src} download>
                  Download the video
                </a>{" "}
                instead.
              </p>
            </video>
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          )}
        </AspectRatio>
        <div className="bg-muted/50 p-4">
          <p className="text-center text-sm font-medium">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
