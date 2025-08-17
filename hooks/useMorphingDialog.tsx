"use client";

import { useContext, useId, useRef, useState } from "react";
import { createContext } from "react";

export type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

export const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

export function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      "useMorphingDialog must be used within a MorphingDialogProvider",
    );
  }
  return context;
}

export function useMorphingDialogState() {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  return {
    isOpen,
    setIsOpen,
    uniqueId,
    triggerRef,
  };
}