"use client";

import Image from "next/image";

import { AnimatedAsset } from "@/components/ui/animated-asset";
import type { ProjectThumbnail as Thumbnail } from "@/lib/data/project-thumbnails";

/** The evidence frame at list scale — the case-study vocabulary, one size down. */
const FRAME =
  "rounded-xl border border-zinc-200 bg-zinc-100 p-2 ring-0 dark:border-zinc-800 dark:bg-zinc-900";

/**
 * One project's picture in a list row.
 *
 * It sits beside the row's link rather than inside it: the lightbox trigger is
 * a button, and a button inside an anchor is invalid and ambiguous to click.
 * Two targets, each doing one thing — the picture enlarges in place, the words
 * navigate.
 *
 * Two projects have no product photography and show a case-study figure here
 * instead. At tile size a figure reads as shape rather than as text, which is
 * the honest thing for it to be doing in a list; the lightbox is what makes it
 * legible, so the tile is a promise the zoom keeps. It carries `diagram-figure`
 * because that class is where the `--dg-*` palette is declared — without it the
 * figure renders with no colours at all.
 */
export function ProjectThumbnail({ thumbnail }: { thumbnail: Thumbnail }) {
  if (thumbnail.kind === "diagram") {
    const { Diagram, alt, fitWhole } = thumbnail;

    return (
      <AnimatedAsset
        label={alt}
        // Zoomed and centred rather than fitted. A whole figure scaled into a
        // 288px tile puts its 1px rules under a third of a pixel and reads as
        // an empty box; at 190% the focal node and the heavy rules survive, and
        // the tile becomes a legible fragment instead of an illegible whole.
        // A figure can opt out with fitWhole: a wordmark cropped to a
        // fragment ("ANDY' / KILLS") is worse than a small whole.
        className="aspect-[16/10] overflow-hidden rounded-lg"
        containerClassName={`diagram-figure ${FRAME}`}
        expandedChildren={
          <div className="diagram-figure flex h-full w-full items-center justify-center bg-white p-4 dark:bg-zinc-950">
            <Diagram />
          </div>
        }
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className={fitWhole ? "w-full" : "w-[190%] shrink-0"}>
            <Diagram />
          </div>
        </div>
      </AnimatedAsset>
    );
  }

  const { src, alt, width, height, fit } = thumbnail;

  return (
    <AnimatedAsset
      label={alt}
      className="aspect-[16/10] rounded-lg"
      containerClassName={FRAME}
      expandedChildren={
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-contain"
        />
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 640px) 18rem, 100vw"
        className={
          fit === "contain"
            ? "h-full w-full object-contain"
            : "h-full w-full object-cover"
        }
      />
    </AnimatedAsset>
  );
}
