"use client";

import React from "react";
import { MotionConfig, Transition } from "motion/react";
import { MorphingDialogContext, useMorphingDialogState } from "@/hooks/useMorphingDialog";

export type MorphingDialogProviderProps = {
  children: React.ReactNode;
  transition?: Transition;
};

export function MorphingDialogProvider({
  children,
  transition,
}: MorphingDialogProviderProps) {
  const dialogState = useMorphingDialogState();

  return (
    <MorphingDialogContext.Provider value={dialogState}>
      <MotionConfig
        transition={
          transition ?? {
            type: "spring",
            bounce: 0.1,
            duration: 0.4,
          }
        }
      >
        {children}
      </MotionConfig>
    </MorphingDialogContext.Provider>
  );
}