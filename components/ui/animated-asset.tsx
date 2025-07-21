"use client";

import { cn } from "@/lib/utils";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";

type AnimatedAssetProps = {
  children: React.ReactNode;
  expandedChildren?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  expandedClassName?: string;
  transition?: {
    type?: string;
    bounce?: number;
    duration?: number;
  };
  hoverScale?: number;
  showCloseButton?: boolean;
};

export const AnimatedAsset = ({
  children,
  expandedChildren,
  className,
  containerClassName,
  expandedClassName,
  transition = {
    type: "spring",
    bounce: 0,
    duration: 0.3,
  },
  hoverScale = 1.02,
  showCloseButton = true,
}: AnimatedAssetProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50",
        containerClassName,
      )}
    >
      <MorphingDialog transition={transition}>
        <MorphingDialogTrigger>
          <motion.div
            className={cn(
              "aspect-video w-full cursor-zoom-in rounded-xl overflow-hidden",
              className,
            )}
            whileHover={{ scale: hoverScale }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent
            className={cn(
              "relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50",
              expandedClassName,
            )}
          >
            <div className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh] overflow-hidden">
              {expandedChildren || children}
            </div>
          </MorphingDialogContent>
          {showCloseButton && (
            <MorphingDialogClose
              className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 dark:bg-zinc-900"
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: { delay: 0.3, duration: 0.1 },
                },
                exit: { opacity: 0, transition: { duration: 0 } },
              }}
            >
              <XIcon className="h-5 w-5 text-zinc-500" />
            </MorphingDialogClose>
          )}
        </MorphingDialogContainer>
      </MorphingDialog>
    </div>
  );
};

type AnimatedVideoProps = {
  src: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
} & Omit<AnimatedAssetProps, "children" | "expandedChildren">;

export const AnimatedVideo = ({
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  poster,
  className,
  ...props
}: AnimatedVideoProps) => {
  const videoElement = (
    <video
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      poster={poster}
      className={cn("aspect-video w-full h-full object-cover", className)}
    />
  );

  return <AnimatedAsset {...props}>{videoElement}</AnimatedAsset>;
};

type AnimatedImageProps = {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
} & Omit<AnimatedAssetProps, "children" | "expandedChildren">;

import Image from "next/image";

// ... (rest of the file)

export const AnimatedImage = ({
  src,
  alt,
  objectFit = "cover",
  className,
  ...props
}: AnimatedImageProps) => {
  const imageElement = (
    <Image
      src={src}
      alt={alt}
      layout="fill"
      objectFit={objectFit}
      className={cn("aspect-video w-full h-full", className)}
    />
  );

  return <AnimatedAsset {...props}>{imageElement}</AnimatedAsset>;
};

type AnimatedIframeProps = {
  src: string;
  title: string;
  className?: string;
} & Omit<AnimatedAssetProps, "children" | "expandedChildren">;

export const AnimatedIframe = ({
  src,
  title,
  className,
  ...props
}: AnimatedIframeProps) => {
  const iframeElement = (
    <iframe
      src={src}
      title={title}
      className={cn(
        "aspect-video w-full h-full border-0 rounded-xl",
        className,
      )}
      allowFullScreen
    />
  );

  return <AnimatedAsset {...props}>{iframeElement}</AnimatedAsset>;
};
