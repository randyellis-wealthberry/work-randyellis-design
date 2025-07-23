"use client";

import Image from "next/image";
import { ArchiveItem } from "@/app/data";

interface ArchiveThumbnailProps {
  item: ArchiveItem;
}

export function ArchiveThumbnail({ item }: ArchiveThumbnailProps) {
  // Check if this is a video type with a video URL
  if (item.type === "video" && item.video) {
    return (
      <div className="aspect-video overflow-hidden">
        <iframe
          src={item.video}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title={item.title}
        />
      </div>
    );
  }

  // Fallback to static thumbnail or placeholder
  const thumbnailSrc =
    item.thumbnail || "/images/archive/placeholder-thumbnail.jpg";

  return (
    <div className="aspect-video overflow-hidden">
      <Image
        src={thumbnailSrc}
        alt={item.title}
        width={500}
        height={300}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
