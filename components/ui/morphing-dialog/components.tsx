"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";

export type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function MorphingDialogTitle({
  children,
  className,
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <h2
      id={`motion-ui-morphing-dialog-title-${uniqueId}`}
      className={cn("text-lg font-semibold", className)}
    >
      {children}
    </h2>
  );
}

export type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function MorphingDialogSubtitle({
  children,
  className,
}: MorphingDialogSubtitleProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
}

export type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export function MorphingDialogDescription({
  children,
  className,
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <div
      id={`motion-ui-morphing-dialog-description-${uniqueId}`}
      className={cn("text-sm", className)}
    >
      {children}
    </div>
  );
}

export type MorphingDialogImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export function MorphingDialogImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
}: MorphingDialogImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

MorphingDialogTitle.displayName = "MorphingDialogTitle";
MorphingDialogSubtitle.displayName = "MorphingDialogSubtitle";
MorphingDialogDescription.displayName = "MorphingDialogDescription";
MorphingDialogImage.displayName = "MorphingDialogImage";
