// Centralized dynamic imports for better code splitting
import { lazy } from "react";

// Heavy 3D/WebGL Components
export const AnimatedWebGL = lazy(() =>
  import("@/components/ui/animated-webgl").then((m) => ({
    default: m.AnimatedWebGL,
  })),
);

export const UnicornWebGL = lazy(() =>
  import("@/components/ui/unicorn-webgl").then((m) => ({
    default: m.UnicornWebGL,
  })),
);

// Heavy Video Components
export const HoverVideo = lazy(() =>
  import("@/components/ui/hover-video").then((m) => ({
    default: m.HoverVideo,
  })),
);

export const VideoPlayer = lazy(() =>
  import("@/components/ui/video-player").then((m) => ({
    default: m.VideoPlayer,
  })),
);

// Heavy Animation Components - Client-side only
export const LottieAnimation = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({
    default: m.DotLottieReact,
  })),
);

// Complex UI Components
export const TestResults = lazy(() =>
  import("@/components/ui/test-results").then((m) => ({
    default: m.TestResults,
  })),
);

export const UserTestingSection = lazy(() =>
  import("@/components/ui/user-testing-section").then((m) => ({
    default: m.UserTestingSection,
  })),
);

export const TestimonialCarousel = lazy(() =>
  import("@/components/ui/testimonial-carousel").then((m) => ({
    default: m.TestimonialCarousel,
  })),
);

// Chart/Visualization Components (if any)
// export const DataVisualization = lazy(() =>
//   import("@/components/ui/data-visualization")
//     .then((m) => ({ default: m.DataVisualization }))
//     .catch(() => ({ default: () => null })),
// );
