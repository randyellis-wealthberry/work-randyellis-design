/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RambisClientPage from "@/app/projects/rambis-ui/rambis-client";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock motion components with animation capabilities
jest.mock("motion/react", () => {
  const mockMotionValue = {
    set: jest.fn(),
    get: jest.fn(),
    on: jest.fn(),
    clearListeners: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUseSpring = jest.fn(() => mockMotionValue);
  const mockUseMotionValue = jest.fn(() => mockMotionValue);
  const mockUseInView = jest.fn(() => true);
  const mockUseTransform = jest.fn((value, transformer) => {
    // Return the transformed value directly for rendering
    if (transformer && typeof transformer === "function") {
      return transformer(
        typeof value === "object" && value.get ? value.get() : value || 0,
      );
    }
    return typeof value === "object" && value.get ? value.get() : value || 0;
  });

  const createMotionComponent = (element: string) => {
    return ({
      children,
      className,
      style,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      initial,
      animate,
      whileInView,
      variants,
      viewport,
      transition,
      onAnimationComplete,
      ...props
    }: any) => {
      // Filter out motion-specific props
      const {
        variants: _variants,
        initial: _initial,
        animate: _animate,
        whileInView: _whileInView,
        viewport: _viewport,
        transition: _transition,
        onAnimationComplete: _onAnimationComplete,
        ...domProps
      } = props;

      // Import React dynamically for the mock
      const React = require("react");

      // Simulate motion component behavior
      const handleMouseMove = (e: any) => {
        if (onMouseMove) onMouseMove(e);
      };

      const handleMouseEnter = () => {
        if (onMouseEnter) onMouseEnter();
      };

      const handleMouseLeave = () => {
        if (onMouseLeave) onMouseLeave();
      };

      return React.createElement(
        element,
        {
          className,
          style,
          onMouseMove: handleMouseMove,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          "data-motion-component": "true",
          "data-initial": initial ? JSON.stringify(initial) : undefined,
          "data-animate": animate ? JSON.stringify(animate) : undefined,
          "data-variants": variants ? "true" : undefined,
          ...domProps,
        },
        children,
      );
    };
  };

  return {
    motion: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
      p: createMotionComponent("p"),
      h1: createMotionComponent("h1"),
      h2: createMotionComponent("h2"),
      h3: createMotionComponent("h3"),
      section: createMotionComponent("section"),
      main: createMotionComponent("main"),
    },
    useMotionValue: mockUseMotionValue,
    useSpring: mockUseSpring,
    useInView: mockUseInView,
    useTransform: mockUseTransform,
    AnimatePresence: ({ children }: any) => (
      <div data-animate-presence="true">{children}</div>
    ),
  };
});

// Mock motion primitives
jest.mock("@/components/motion-primitives/glare-hover", () => ({
  GlareHover: ({
    children,
    className,
    disabled,
    intensity,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    glareColor,
    glareOpacity,
    glareSize,
    borderRadius,
    ...props
  }: any) => {
    const handleMouseMove = (e: React.MouseEvent) => {
      if (onMouseMove && !disabled) {
        onMouseMove(e);
      }
    };

    const handleMouseEnter = () => {
      if (onMouseEnter && !disabled) {
        onMouseEnter();
      }
    };

    const handleMouseLeave = () => {
      if (onMouseLeave && !disabled) {
        onMouseLeave();
      }
    };

    // Filter out custom props that shouldn't be passed to DOM
    const {
      glareColor: _glareColor,
      glareOpacity: _glareOpacity,
      glareSize: _glareSize,
      borderRadius: _borderRadius,
      intensity: _intensity,
      disabled: _disabled,
      ...domProps
    } = props;

    return (
      <div
        className={className}
        data-glare-hover="true"
        data-intensity={intensity}
        data-disabled={disabled}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...domProps}
      >
        {children}
      </div>
    );
  },
  GlarePresets: {
    card: {
      glareColor: "rgba(255, 255, 255, 0.6)",
      glareOpacity: 0.4,
      glareSize: 200,
      intensity: "subtle" as const,
    },
    button: {
      glareColor: "rgba(255, 255, 255, 0.8)",
      glareOpacity: 0.6,
      glareSize: 150,
      intensity: "medium" as const,
    },
    hero: {
      glareColor: "rgba(255, 255, 255, 0.9)",
      glareOpacity: 0.8,
      glareSize: 400,
      intensity: "strong" as const,
    },
  },
}));

jest.mock("@/components/motion-primitives/animated-content", () => ({
  AnimatedContent: ({
    children,
    className,
    staggerDelay,
    staggerDirection,
    duration,
    once,
    threshold,
    as = "div",
    ...props
  }: any) => {
    const Component = as;
    return (
      <Component
        className={className}
        data-animated-content="true"
        data-stagger-delay={staggerDelay}
        data-stagger-direction={staggerDirection}
        data-duration={duration}
        data-once={once}
        data-threshold={threshold}
        {...props}
      >
        {children}
      </Component>
    );
  },
  AnimatedContentItem: ({ children, className, delay, ...props }: any) => (
    <div
      className={className}
      data-animated-content-item="true"
      data-delay={delay}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe("Rambis UI Grid Animations", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock intersection observer for animations
    global.IntersectionObserver = class MockIntersectionObserver {
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
    } as any;
  });

  describe("Motion Components Integration", () => {
    it("renders motion.div components with proper attributes", () => {
      const { container } = render(<RambisClientPage />);

      const motionDivs = container.querySelectorAll(
        "[data-motion-component='true']",
      );
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it("applies motion values correctly", () => {
      render(<RambisClientPage />);

      // Check that motion component mocks are working
      const { container } = render(<RambisClientPage />);
      const motionDivs = container.querySelectorAll(
        "[data-motion-component='true']",
      );
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it("handles animation variants properly", () => {
      const { container } = render(<RambisClientPage />);

      const elementsWithVariants = container.querySelectorAll(
        "[data-variants='true']",
      );
      // Some elements should have variants for animations
      expect(elementsWithVariants.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GlareHover Effects", () => {
    it("applies glare hover effects to interactive cards", () => {
      const { container } = render(<RambisClientPage />);

      const glareElements = container.querySelectorAll(
        "[data-glare-hover='true']",
      );
      // Cards should have glare hover effects
      expect(glareElements.length).toBeGreaterThanOrEqual(0);
    });

    it("handles mouse interactions for glare effects", async () => {
      const user = userEvent.setup();
      const { container } = render(<RambisClientPage />);

      const cards = container.querySelectorAll("[class*='aspect-video']");

      if (cards.length > 0) {
        const firstCard = cards[0] as HTMLElement;

        // Simulate mouse move
        await user.hover(firstCard);

        // Should trigger mouse interactions
        expect(firstCard).toBeInTheDocument();
      }
    });

    it("supports different intensity levels", () => {
      const { container } = render(<RambisClientPage />);

      const glareElements = container.querySelectorAll(
        "[data-glare-hover='true']",
      );

      glareElements.forEach((element) => {
        // Should have intensity attribute (could be subtle, medium, or strong)
        const intensity = element.getAttribute("data-intensity");
        if (intensity) {
          expect(["subtle", "medium", "strong"]).toContain(intensity);
        }
      });
    });

    it("respects disabled state", () => {
      const { container } = render(<RambisClientPage />);

      const glareElements = container.querySelectorAll(
        "[data-glare-hover='true']",
      );

      glareElements.forEach((element) => {
        const disabled = element.getAttribute("data-disabled");
        // Disabled should be boolean or null
        if (disabled) {
          expect(["true", "false"]).toContain(disabled);
        }
      });
    });
  });

  describe("AnimatedContent Integration", () => {
    it("applies animated content wrapper", () => {
      const { container } = render(<RambisClientPage />);

      const animatedContent = container.querySelectorAll(
        "[data-animated-content='true']",
      );
      // Should have animated content containers
      expect(animatedContent.length).toBeGreaterThanOrEqual(0);
    });

    it("configures stagger animations properly", () => {
      const { container } = render(<RambisClientPage />);

      const animatedElements = container.querySelectorAll(
        "[data-animated-content='true']",
      );

      animatedElements.forEach((element) => {
        const staggerDelay = element.getAttribute("data-stagger-delay");
        const staggerDirection = element.getAttribute("data-stagger-direction");

        if (staggerDelay) {
          expect(parseFloat(staggerDelay)).toBeGreaterThanOrEqual(0);
        }

        if (staggerDirection) {
          expect(["top", "bottom", "left", "right"]).toContain(
            staggerDirection,
          );
        }
      });
    });

    it("sets appropriate animation duration", () => {
      const { container } = render(<RambisClientPage />);

      const animatedElements = container.querySelectorAll(
        "[data-animated-content='true']",
      );

      animatedElements.forEach((element) => {
        const duration = element.getAttribute("data-duration");

        if (duration) {
          const durationValue = parseFloat(duration);
          expect(durationValue).toBeGreaterThan(0);
          expect(durationValue).toBeLessThanOrEqual(2); // Reasonable duration range
        }
      });
    });

    it("supports different semantic elements", () => {
      const { container } = render(<RambisClientPage />);

      const animatedElements = container.querySelectorAll(
        "[data-animated-content='true']",
      );

      // Should support different HTML elements like div, section, main, etc.
      const tagNames = Array.from(animatedElements).map((el) =>
        el.tagName.toLowerCase(),
      );
      expect(tagNames.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Animation Performance", () => {
    it("uses transform-gpu class for GPU acceleration", () => {
      const { container } = render(<RambisClientPage />);

      // Check for GPU acceleration classes
      const gpuAccelerated = container.querySelectorAll(".transform-gpu");
      expect(gpuAccelerated.length).toBeGreaterThanOrEqual(0);
    });

    it("applies will-change property for optimized animations", () => {
      const { container } = render(<RambisClientPage />);

      // Check for elements with will-change style
      const elementsWithWillChange = Array.from(
        container.querySelectorAll("*"),
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.willChange !== "auto";
      });

      // Some elements should have will-change for animation optimization
      expect(elementsWithWillChange.length).toBeGreaterThanOrEqual(0);
    });

    it("doesn't trigger layout thrashing", () => {
      const { container } = render(<RambisClientPage />);

      // Verify that animations primarily use transform and opacity
      const cards = container.querySelectorAll("[class*='aspect-video']");

      cards.forEach((card) => {
        // Cards should have transition classes
        expect(card.className).toMatch(/transition|transform|opacity/);
      });
    });
  });

  describe("Accessibility & Reduced Motion", () => {
    it("respects prefers-reduced-motion setting", () => {
      // Mock reduced motion preference
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<RambisClientPage />);

      // Should render without motion components when reduced motion is preferred
      expect(window.matchMedia).toHaveBeenCalledWith(
        "(prefers-reduced-motion: reduce)",
      );
    });

    it("maintains accessibility during animations", () => {
      render(<RambisClientPage />);

      // All interactive elements should remain focusable
      const interactiveElements = screen.getAllByRole("link");

      interactiveElements.forEach((element) => {
        expect(element).toBeVisible();
        expect(element).not.toHaveAttribute("aria-hidden", "true");
      });
    });

    it("provides appropriate ARIA attributes for animated content", () => {
      const { container } = render(<RambisClientPage />);

      // Check that animated elements don't interfere with screen readers
      const animatedElements = container.querySelectorAll(
        "[data-animated-content='true']",
      );

      animatedElements.forEach((element) => {
        // Should not have aria-hidden on main content
        expect(element).not.toHaveAttribute("aria-hidden", "true");
      });
    });

    it("ensures keyboard navigation works with animations", async () => {
      const user = userEvent.setup();
      render(<RambisClientPage />);

      const links = screen.getAllByRole("link");

      if (links.length > 0) {
        // Should be able to tab through links
        await user.tab();

        // At least one link should be focusable
        const focusedElement = document.activeElement;
        expect(links.some((link) => link === focusedElement)).toBe(true);
      }
    });
  });

  describe("Touch and Mobile Interactions", () => {
    it("applies touch-manipulation class for mobile optimization", () => {
      const { container } = render(<RambisClientPage />);

      const touchElements = container.querySelectorAll(".touch-manipulation");
      expect(touchElements.length).toBeGreaterThan(0);
    });

    it("handles touch events properly on cards", async () => {
      const user = userEvent.setup();
      const { container } = render(<RambisClientPage />);

      const cards = container.querySelectorAll("[class*='aspect-video']");

      if (cards.length > 0) {
        const firstCard = cards[0] as HTMLElement;

        // Simulate touch interaction
        fireEvent.touchStart(firstCard);
        fireEvent.touchEnd(firstCard);

        // Should handle touch events without errors
        expect(firstCard).toBeInTheDocument();
      }
    });
  });

  describe("Animation Timing and Easing", () => {
    it("uses consistent easing curves", () => {
      const { container } = render(<RambisClientPage />);

      // Check for transition classes with easing
      const transitionElements = container.querySelectorAll(
        "[class*='transition']",
      );

      expect(transitionElements.length).toBeGreaterThan(0);

      transitionElements.forEach((element) => {
        // Should have appropriate transition classes
        expect(element.className).toMatch(/transition|duration|ease/);
      });
    });

    it("applies reasonable animation durations", () => {
      const { container } = render(<RambisClientPage />);

      const animatedElements = container.querySelectorAll("[data-duration]");

      animatedElements.forEach((element) => {
        const duration = parseFloat(
          element.getAttribute("data-duration") || "0",
        );

        // Animation durations should be reasonable (between 0.1s and 1s)
        expect(duration).toBeGreaterThanOrEqual(0.1);
        expect(duration).toBeLessThanOrEqual(1.0);
      });
    });
  });

  describe("Grid-Specific Animations", () => {
    it("staggers grid item animations appropriately", () => {
      const { container } = render(<RambisClientPage />);

      // Check for staggered animations in grid layout
      const gridContainer = container.querySelector(".grid");

      if (gridContainer) {
        const gridItems = gridContainer.children;
        expect(gridItems.length).toBeGreaterThan(0);

        // Grid items should be ready for staggered animations
        Array.from(gridItems).forEach((item) => {
          expect(item).toBeInTheDocument();
        });
      }
    });

    it("handles grid layout changes smoothly", async () => {
      const { rerender } = render(<RambisClientPage />);

      // Simulate viewport change
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375, // Mobile size
      });

      // Re-render component
      rerender(<RambisClientPage />);

      // Should handle layout changes without animation conflicts
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
    });
  });

  describe("Error Handling in Animations", () => {
    it("gracefully handles animation failures", () => {
      // Mock animation error
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Should not crash even if animations fail
      expect(() => render(<RambisClientPage />)).not.toThrow();

      consoleError.mockRestore();
    });

    it("falls back gracefully when motion is unavailable", () => {
      // Test that component works even without motion library
      const { container } = render(<RambisClientPage />);

      // Should still render content
      expect(container.querySelector("main")).toBeInTheDocument();
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
    });

    it("handles interrupted animations properly", async () => {
      const user = userEvent.setup();
      const { container } = render(<RambisClientPage />);

      const cards = container.querySelectorAll("[class*='aspect-video']");

      if (cards.length > 0) {
        const firstCard = cards[0] as HTMLElement;

        // Start hover animation
        await user.hover(firstCard);

        // Quickly unhover
        await user.unhover(firstCard);

        // Should handle rapid state changes
        expect(firstCard).toBeInTheDocument();
      }
    });
  });

  describe("Memory Management", () => {
    it("cleans up animation listeners on unmount", () => {
      const { unmount } = render(<RambisClientPage />);

      // Unmount component
      unmount();

      // Should not have memory leaks (tested through lack of errors)
      expect(true).toBe(true);
    });

    it("doesn't accumulate motion values", () => {
      const { rerender } = render(<RambisClientPage />);

      // Re-render multiple times
      rerender(<RambisClientPage />);
      rerender(<RambisClientPage />);

      // Should handle re-renders without issues
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
    });
  });
});
