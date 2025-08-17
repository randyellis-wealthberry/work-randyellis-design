"use client";

// Re-export all components from the modular structure
export { MorphingDialogProvider } from "./morphing-dialog/provider";
export { MorphingDialogTrigger } from "./morphing-dialog/trigger";
export { MorphingDialogContent } from "./morphing-dialog/content";
export { MorphingDialogContainer, MorphingDialogClose } from "./morphing-dialog/container";
export {
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from "./morphing-dialog/components";
export { useMorphingDialog, useMorphingDialogState } from "@/hooks/useMorphingDialog";

export type { MorphingDialogContextType } from "@/hooks/useMorphingDialog";

// Backward compatibility - main component export
export { MorphingDialogProvider as MorphingDialog } from "./morphing-dialog/provider";