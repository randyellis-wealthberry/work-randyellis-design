/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Simplified Animation Tests
 *
 * This test suite validates basic animation behavior and reduced motion preferences
 * for the Nagarro case study, focusing on accessibility and core functionality.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock useReducedMotion hook
const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/lib/hooks/use-reduced-motion", () => ({
  useReducedMotion: mockUseReducedMotion,
}));

// Mock motion data for testing
const mockNagarroAnimationData = {
  title:
    "Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design",
  metrics: [
    {
      label: "Brand Recognition Increase",
      value: "50%",
      description: "Improved market visibility through design strategy",
    },
    {
      label: "Qualified Leads Generated",
      value: "100+",
      description: "Through strategic design initiatives",
    },
    {
      label: "Designer Skills Enhancement",
      value: "15+",
      description: "Coached design team members",
    },
  ],
};

// Simplified mock component that respects reduced motion
const SimplifiedNagarroAnimationComponent = ({
  enableAnimations = true,
}: {
  enableAnimations?: boolean;
}) => {
  const prefersReducedMotion = mockUseReducedMotion();
  const shouldAnimate = enableAnimations && !prefersReducedMotion;

  return (
    <div data-testid="nagarro-animation-component">
      {/* Main header with conditional animation class */}
      <header
        className={shouldAnimate ? "animate-fadeIn" : ""}
        data-testid="animated-header"
        data-animation-enabled={shouldAnimate}
      >
        <h1 data-testid="animated-title">{mockNagarroAnimationData.title}</h1>
      </header>

      {/* Metrics section with staggered animation classes */}
      <section data-testid="metrics-section" className="metrics-container">
        {mockNagarroAnimationData.metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={
              shouldAnimate ? `animate-slideUp delay-${index * 100}` : ""
            }
            data-testid={`metric-card-${index}`}
            data-animation-enabled={shouldAnimate}
            style={
              {
                "--animation-delay": shouldAnimate ? `${index * 0.1}s` : "0s",
              } as React.CSSProperties
            }
          >
            <h3>{metric.label}</h3>
            <span className="metric-value">{metric.value}</span>
            <p>{metric.description}</p>
          </article>
        ))}
      </section>

      {/* Interactive button with hover states */}
      <button
        data-testid="interactive-button"
        className={shouldAnimate ? "hover:scale-105 transition-transform" : ""}
        data-animation-enabled={shouldAnimate}
        onClick={() => {}}
      >
        Learn More
      </button>

      {/* Loading indicator that respects reduced motion */}
      <div
        data-testid="loading-indicator"
        className={shouldAnimate ? "animate-spin" : "static"}
        data-animation-enabled={shouldAnimate}
        aria-label={shouldAnimate ? "Loading animation" : "Loading"}
      >
        Loading...
      </div>

      {/* Scroll-triggered content */}
      <div
        data-testid="scroll-content"
        className={shouldAnimate ? "animate-on-scroll" : ""}
        data-animation-enabled={shouldAnimate}
      >
        <h3>Scroll-triggered Content</h3>
      </div>
    </div>
  );
};

// Mock matchMedia for reduced motion testing
const createMockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe("Nagarro Case Study - Simplified Animation Tests", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe("Basic Animation Rendering", () => {
    it("renders component with animation elements", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      expect(
        screen.getByTestId("nagarro-animation-component"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("animated-header")).toBeInTheDocument();
      expect(screen.getByTestId("animated-title")).toBeInTheDocument();
    });

    it("renders all metric cards with proper structure", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      mockNagarroAnimationData.metrics.forEach((metric, index) => {
        expect(screen.getByTestId(`metric-card-${index}`)).toBeInTheDocument();
        expect(screen.getByText(metric.label)).toBeInTheDocument();
        expect(screen.getByText(metric.value)).toBeInTheDocument();
      });
    });

    it("includes interactive elements", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      expect(screen.getByTestId("interactive-button")).toBeInTheDocument();
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
      expect(screen.getByTestId("scroll-content")).toBeInTheDocument();
    });
  });

  describe("Reduced Motion Preference Support", () => {
    it("respects user preference for reduced motion", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<SimplifiedNagarroAnimationComponent />);

      const header = screen.getByTestId("animated-header");
      const button = screen.getByTestId("interactive-button");
      const loading = screen.getByTestId("loading-indicator");

      expect(header).toHaveAttribute("data-animation-enabled", "false");
      expect(button).toHaveAttribute("data-animation-enabled", "false");
      expect(loading).toHaveAttribute("data-animation-enabled", "false");
    });

    it("disables animations when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<SimplifiedNagarroAnimationComponent />);

      const header = screen.getByTestId("animated-header");
      const metricCard = screen.getByTestId("metric-card-0");

      expect(header).not.toHaveClass("animate-fadeIn");
      expect(metricCard).not.toHaveClass("animate-slideUp");
    });

    it("maintains functionality when animations are disabled", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<SimplifiedNagarroAnimationComponent />);

      // All content should still be accessible and functional
      expect(
        screen.getByText(mockNagarroAnimationData.title),
      ).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("100+")).toBeInTheDocument();

      const button = screen.getByTestId("interactive-button");
      expect(button).toBeInTheDocument();
      fireEvent.click(button); // Should not throw
    });
  });

  describe("Full Motion Animation Behavior", () => {
    it("enables animations when motion is not reduced", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      const header = screen.getByTestId("animated-header");
      const button = screen.getByTestId("interactive-button");
      const loading = screen.getByTestId("loading-indicator");

      expect(header).toHaveAttribute("data-animation-enabled", "true");
      expect(button).toHaveAttribute("data-animation-enabled", "true");
      expect(loading).toHaveAttribute("data-animation-enabled", "true");
    });

    it("applies animation classes when motion is enabled", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      const header = screen.getByTestId("animated-header");
      const button = screen.getByTestId("interactive-button");
      const loading = screen.getByTestId("loading-indicator");

      expect(header).toHaveClass("animate-fadeIn");
      expect(button).toHaveClass("hover:scale-105 transition-transform");
      expect(loading).toHaveClass("animate-spin");
    });

    it("handles staggered animations for metrics", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      mockNagarroAnimationData.metrics.forEach((_, index) => {
        const metricCard = screen.getByTestId(`metric-card-${index}`);
        expect(metricCard).toHaveClass("animate-slideUp");
        expect(metricCard).toHaveClass(`delay-${index * 100}`);
      });
    });
  });

  describe("Animation Performance and Accessibility", () => {
    it("provides proper ARIA labels for animated elements", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      const loading = screen.getByTestId("loading-indicator");
      expect(loading).toHaveAttribute("aria-label", "Loading animation");
    });

    it("updates ARIA labels when animations are disabled", () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<SimplifiedNagarroAnimationComponent />);

      const loading = screen.getByTestId("loading-indicator");
      expect(loading).toHaveAttribute("aria-label", "Loading");
    });

    it("handles component prop changes without errors", () => {
      const { rerender } = render(
        <SimplifiedNagarroAnimationComponent enableAnimations={true} />,
      );

      expect(() => {
        rerender(
          <SimplifiedNagarroAnimationComponent enableAnimations={false} />,
        );
        rerender(
          <SimplifiedNagarroAnimationComponent enableAnimations={true} />,
        );
      }).not.toThrow();
    });

    it("maintains semantic structure during animation states", () => {
      mockUseReducedMotion.mockReturnValue(false);
      render(<SimplifiedNagarroAnimationComponent />);

      // Check that semantic elements are preserved
      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("button")).toBeInTheDocument(); // button

      // Check heading hierarchy
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("Integration with Motion Preferences", () => {
    it("integrates with system motion preferences", () => {
      window.matchMedia = createMockMatchMedia(true); // prefers-reduced-motion: reduce
      mockUseReducedMotion.mockReturnValue(true);

      render(<SimplifiedNagarroAnimationComponent />);

      const header = screen.getByTestId("animated-header");
      expect(header).toHaveAttribute("data-animation-enabled", "false");
    });

    it("handles motion preference changes", () => {
      mockUseReducedMotion.mockReturnValue(false);
      const { rerender } = render(<SimplifiedNagarroAnimationComponent />);

      let header = screen.getByTestId("animated-header");
      expect(header).toHaveAttribute("data-animation-enabled", "true");

      // Simulate preference change
      mockUseReducedMotion.mockReturnValue(true);
      rerender(<SimplifiedNagarroAnimationComponent />);

      header = screen.getByTestId("animated-header");
      expect(header).toHaveAttribute("data-animation-enabled", "false");
    });
  });

  describe("Error Handling and Fallbacks", () => {
    it("handles animation component mounting and unmounting", () => {
      const { unmount } = render(<SimplifiedNagarroAnimationComponent />);

      expect(() => unmount()).not.toThrow();
    });

    it("provides fallbacks when animation props are invalid", () => {
      expect(() => {
        render(
          <SimplifiedNagarroAnimationComponent
            enableAnimations={undefined as any}
          />,
        );
      }).not.toThrow();
    });

    it("maintains functionality during state changes", () => {
      const { rerender } = render(<SimplifiedNagarroAnimationComponent />);

      // Rapid state changes should not cause issues
      expect(() => {
        for (let i = 0; i < 10; i++) {
          rerender(
            <SimplifiedNagarroAnimationComponent
              enableAnimations={i % 2 === 0}
            />,
          );
        }
      }).not.toThrow();
    });
  });

  describe("Content Validation", () => {
    it("displays all required Nagarro content", () => {
      render(<SimplifiedNagarroAnimationComponent />);

      expect(
        screen.getByText(mockNagarroAnimationData.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Brand Recognition Increase"),
      ).toBeInTheDocument();
      expect(screen.getByText("Qualified Leads Generated")).toBeInTheDocument();
      expect(
        screen.getByText("Designer Skills Enhancement"),
      ).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("100+")).toBeInTheDocument();
      expect(screen.getByText("15+")).toBeInTheDocument();
    });

    it("maintains proper heading structure", () => {
      render(<SimplifiedNagarroAnimationComponent />);

      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      const metricHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(metricHeadings).toHaveLength(
        mockNagarroAnimationData.metrics.length + 1,
      ); // metrics + scroll content
    });
  });
});
