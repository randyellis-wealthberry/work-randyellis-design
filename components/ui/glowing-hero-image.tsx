"use client";

import Image from "next/image";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { cn } from "@/lib/utils";

interface GlowingHeroImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  glowColors?: string[];
  glowMode?:
    | "rotate"
    | "pulse"
    | "breathe"
    | "colorShift"
    | "flowHorizontal"
    | "static";
  glowBlur?:
    | number
    | "softest"
    | "soft"
    | "medium"
    | "strong"
    | "stronger"
    | "strongest"
    | "none";
  glowScale?: number;
}

export function GlowingHeroImage({
  src,
  alt,
  fill = true,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
  className,
  containerClassName,
  glowColors = ["#0894FF", "#C959DD", "#FF2E54", "#FF9004"],
  glowMode = "static",
  glowBlur = "medium",
  glowScale = 1.02,
}: GlowingHeroImageProps) {
  return (
    <div className={cn("relative mx-auto mb-8", containerClassName)}>
      {/* Main container - matches the user's pattern exactly */}
      <div className="relative aspect-[16/4.5] w-full max-w-5xl">
        {/* Professional Glow Effect - background layer */}
        <GlowEffect
          colors={glowColors}
          mode={glowMode}
          blur={glowBlur}
          scale={glowScale}
          className="opacity-60"
        />

        {/* Content layer - sits on top of glow */}
        <div className="relative aspect-[16/4.5] w-full overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={src}
            alt={alt}
            fill={fill}
            className={cn("object-cover", className)}
            priority={priority}
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
}
