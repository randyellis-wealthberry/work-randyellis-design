"use client";

import React from "react";
import { cn } from "@/lib/utils";
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
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
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
  className?: string;
};

export function MorphingDialogImage({
  src,
  alt,
  className,
}: MorphingDialogImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}