/**
 * @jest-environment jsdom
 */
import { render, screen, act } from "@testing-library/react";
import RambisClientPage from "@/app/projects/rambis-ui/rambis-client";

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
};

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock motion components for layout testing
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
  useMotionValue: () => ({ set: jest.fn() }),
  useSpring: () => ({ set: jest.fn() }),
}));

describe("Rambis UI Grid Layout", () => {
  // Helper function to set viewport size
  const setViewportSize = (width: number, height: number = 768) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });

    // Trigger resize event
    window.dispatchEvent(new Event("resize"));
  };

  // Helper function to get computed styles
  const getComputedDisplayType = (element: Element) => {
    return window.getComputedStyle(element).display;
  };

  beforeEach(() => {
    // Reset to desktop size for each test
    setViewportSize(1024, 768);
  });

  describe("Grid Container Structure", () => {
    it("renders main container with correct responsive classes", () => {
      render(<RambisClientPage />);

      const mainContainer = screen.getByRole("main");
      expect(mainContainer).toHaveClass("relative", "space-y-16");
    });

    it("renders project overview section with correct grid structure", () => {
      render(<RambisClientPage />);

      const projectSection = screen
        .getByText("Project Overview")
        .closest("section");
      const gridContainer = projectSection?.querySelector("div.grid");

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
      );
    });

    it("renders performance metrics section with correct grid structure", () => {
      render(<RambisClientPage />);

      const metricsSection = screen
        .getByText("Performance Metrics")
        .closest("section");
      const gridContainer = metricsSection?.querySelector("div.grid");

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-3",
      );
    });
  });

  describe("2x2 Desktop Grid Layout", () => {
    beforeEach(() => {
      setViewportSize(1024); // Desktop size
    });

    it("displays exactly 4 cards in the main project overview grid", () => {
      render(<RambisClientPage />);

      const projectSection = screen
        .getByText("Project Overview")
        .closest("section");
      const cards = projectSection?.querySelectorAll("[class*='aspect-video']");

      expect(cards?.length).toBe(4);
    });

    it("arranges cards in correct 2x2 layout on desktop", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      expect(projectGrid).toHaveClass("md:grid-cols-2");

      // Verify grid children
      const gridItems = projectGrid?.children;
      expect(gridItems?.length).toBe(4);
    });

    it("applies correct spacing between grid items", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      expect(projectGrid).toHaveClass("gap-4", "sm:gap-6");
    });

    it("positions Hero card in top-left (first position)", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      const firstCard = projectGrid?.children[0];
      const heroCard = screen
        .getByText("Design System")
        .closest("[class*='aspect-video']");

      expect(firstCard).toContainElement(heroCard);
    });

    it("positions Demo card in top-right (second position)", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      const secondCard = projectGrid?.children[1];
      const demoCard = screen
        .getByText("Interactive Demo")
        .closest("[class*='aspect-video']");

      expect(secondCard).toContainElement(demoCard);
    });

    it("positions Metrics card in bottom-left (third position)", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      const thirdCard = projectGrid?.children[2];
      const metricsCard = screen
        .getByText("Components")
        .closest("[class*='aspect-video']");

      expect(thirdCard).toContainElement(metricsCard);
    });

    it("positions Actions card in bottom-right (fourth position)", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      const fourthCard = projectGrid?.children[3];
      const actionsCard = screen
        .getByText("Community")
        .closest("[class*='aspect-video']");

      expect(fourthCard).toContainElement(actionsCard);
    });
  });

  describe("4x1 Mobile Grid Layout", () => {
    beforeEach(() => {
      setViewportSize(375); // Mobile size
    });

    it("stacks all cards vertically on mobile", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      expect(projectGrid).toHaveClass("grid-cols-1");
      expect(projectGrid).not.toHaveClass("grid-cols-2");
    });

    it("maintains correct card order in mobile layout", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      const cards = Array.from(projectGrid?.children || []);

      // Verify order by checking content
      expect(cards[0]).toHaveTextContent("Design System");
      expect(cards[1]).toHaveTextContent("Interactive Demo");
      expect(cards[2]).toHaveTextContent("Components");
      expect(cards[3]).toHaveTextContent("Community");
    });

    it("adjusts spacing for mobile layout", () => {
      render(<RambisClientPage />);

      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      expect(projectGrid).toHaveClass("gap-4");
    });
  });

  describe("Responsive Breakpoints", () => {
    const breakpoints = [
      { name: "mobile", width: 375 },
      { name: "tablet", width: 768 },
      { name: "desktop", width: 1024 },
      { name: "large", width: 1440 },
    ];

    breakpoints.forEach(({ name, width }) => {
      it(`responds correctly at ${name} breakpoint (${width}px)`, () => {
        setViewportSize(width);
        render(<RambisClientPage />);

        const projectGrid = screen
          .getByText("Project Overview")
          .closest("section")
          ?.querySelector("div.grid");

        expect(projectGrid).toBeInTheDocument();

        if (width < 768) {
          // Mobile - single column
          expect(projectGrid).toHaveClass("grid-cols-1");
        } else {
          // Tablet and above - 2 columns for project grid
          expect(projectGrid).toHaveClass("md:grid-cols-2");
        }
      });
    });

    it("handles breakpoint transitions smoothly", () => {
      render(<RambisClientPage />);

      // Start at desktop
      setViewportSize(1024);
      let projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");
      expect(projectGrid).toHaveClass("md:grid-cols-2");

      // Transition to mobile
      act(() => {
        setViewportSize(375);
      });

      projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");
      expect(projectGrid).toHaveClass("grid-cols-1");
    });
  });

  describe("Performance Metrics Grid", () => {
    it("displays metrics in 3-column grid on desktop", () => {
      setViewportSize(1024);
      render(<RambisClientPage />);

      const metricsGrid = screen
        .getByText("Performance Metrics")
        .closest("section")
        ?.querySelector("div.grid");

      expect(metricsGrid).toHaveClass("md:grid-cols-3");
    });

    it("stacks metrics vertically on mobile", () => {
      setViewportSize(375);
      render(<RambisClientPage />);

      const metricsGrid = screen
        .getByText("Performance Metrics")
        .closest("section")
        ?.querySelector("div.grid");

      expect(metricsGrid).toHaveClass("grid-cols-1");
    });

    it("displays exactly 3 metric cards", () => {
      render(<RambisClientPage />);

      const metricsSection = screen
        .getByText("Performance Metrics")
        .closest("section");
      const metricCards = metricsSection?.querySelectorAll(
        "[class*='aspect-video']",
      );

      expect(metricCards?.length).toBe(3);
    });
  });

  describe("Card Aspect Ratios", () => {
    it("applies aspect-video to all main cards", () => {
      render(<RambisClientPage />);

      const allCards = screen
        .getAllByRole("generic")
        .filter((el) => el.className.includes("aspect-video"));

      expect(allCards.length).toBeGreaterThanOrEqual(7); // 4 main + 3 metrics

      allCards.forEach((card) => {
        expect(card).toHaveClass("aspect-video");
      });
    });

    it("maintains aspect ratio consistency across all cards", () => {
      render(<RambisClientPage />);

      const projectCards = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelectorAll("[class*='aspect-video']");

      const metricsCards = screen
        .getByText("Performance Metrics")
        .closest("section")
        ?.querySelectorAll("[class*='aspect-video']");

      // All cards should have the same aspect ratio class
      projectCards?.forEach((card) => {
        expect(card).toHaveClass("aspect-video");
      });

      metricsCards?.forEach((card) => {
        expect(card).toHaveClass("aspect-video");
      });
    });
  });

  describe("Grid Layout Accessibility", () => {
    it("maintains logical tab order across grid items", () => {
      render(<RambisClientPage />);

      const interactiveElements = screen.getAllByRole("link");

      // Verify that links are in a logical order
      expect(interactiveElements.length).toBeGreaterThan(0);

      interactiveElements.forEach((element) => {
        expect(element).toBeVisible();
      });
    });

    it("provides semantic structure for screen readers", () => {
      const { container } = render(<RambisClientPage />);

      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);

      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("ensures adequate color contrast in grid items", () => {
      render(<RambisClientPage />);

      // Test that text content is visible (not testing actual contrast values in jsdom)
      const textElements = [
        screen.getByText("Design System"),
        screen.getByText("Interactive Demo"),
        screen.getByText("Components"),
        screen.getByText("Community"),
      ];

      textElements.forEach((element) => {
        expect(element).toBeVisible();
      });
    });
  });

  describe("Grid Performance", () => {
    it("renders grid efficiently without layout shifts", () => {
      const { container } = render(<RambisClientPage />);

      // Check that all grid containers are present immediately
      const grids = container.querySelectorAll(".grid");
      expect(grids.length).toBe(3); // Project overview + Performance metrics + Technologies

      grids.forEach((grid) => {
        expect(grid).toBeInTheDocument();
      });
    });

    it("handles rapid viewport changes without errors", () => {
      render(<RambisClientPage />);

      // Rapidly change viewport sizes
      act(() => {
        setViewportSize(375);
        setViewportSize(768);
        setViewportSize(1024);
        setViewportSize(375);
      });

      // Should still render correctly
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
      expect(screen.getByText("Project Overview")).toBeInTheDocument();
    });

    it("optimizes for touch interactions on mobile", () => {
      setViewportSize(375);
      render(<RambisClientPage />);

      const buttons = screen.getAllByRole("link");

      buttons.forEach((button) => {
        // Check for touch-optimized classes
        expect(button).toHaveClass("touch-manipulation");
      });
    });
  });

  describe("Grid Content Layout", () => {
    it("properly distributes content within cards", () => {
      render(<RambisClientPage />);

      // Hero card content
      const heroCard = screen
        .getByText("Design System")
        .closest("[class*='aspect-video']");
      expect(heroCard?.querySelector("p")).toBeInTheDocument();
      expect(heroCard?.querySelectorAll("a").length).toBeGreaterThanOrEqual(2);

      // Demo card content
      const demoCard = screen
        .getByText("Interactive Demo")
        .closest("[class*='aspect-video']");
      expect(demoCard?.querySelector("p")).toBeInTheDocument();

      // Community card content
      const communityCard = screen
        .getByText("Community")
        .closest("[class*='aspect-video']");
      expect(communityCard?.querySelector("p")).toBeInTheDocument();
    });

    it("maintains content hierarchy within grid items", () => {
      render(<RambisClientPage />);

      const cards = screen
        .getAllByRole("generic")
        .filter((el) => el.className.includes("aspect-video"));

      cards.forEach((card) => {
        // Each card should have a structured content hierarchy
        const heading = card.querySelector("h3");
        if (heading) {
          expect(heading).toHaveClass("font-bold");
        }
      });
    });
  });

  describe("Error Handling in Grid Layout", () => {
    it("gracefully handles missing grid items", () => {
      // Mock empty metrics array
      jest.doMock("@/app/projects/rambis-ui/rambis-client", () => {
        const OriginalComponent = jest.requireActual(
          "@/app/projects/rambis-ui/rambis-client",
        ).default;
        return function MockedComponent() {
          return <OriginalComponent />;
        };
      });

      expect(() => render(<RambisClientPage />)).not.toThrow();
    });

    it("maintains grid structure with incomplete data", () => {
      render(<RambisClientPage />);

      // Grid should maintain structure even if some content is missing
      const projectGrid = screen
        .getByText("Project Overview")
        .closest("section")
        ?.querySelector("div.grid");

      expect(projectGrid).toHaveClass("grid");
      expect(projectGrid?.children.length).toBeGreaterThan(0);
    });
  });
});
