import type { Metadata } from "next";
import { MotionPrimitivesDemo } from "@/components/motion-primitives/test-demo";

// Internal showcase of the motion-primitives set (AnimatedContent, GlareHover,
// FadeContent, ProgressiveDisclosure). /admin/* is disallowed in robots.ts and
// the middleware adds a noindex header; belt-and-braces here.
export const metadata: Metadata = {
  title: "Motion Primitives Demo",
  robots: { index: false, follow: false },
};

export default function MotionPrimitivesDemoPage() {
  return <MotionPrimitivesDemo />;
}
