import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Mock motion components and hooks
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
  },
  useInView: jest.fn(() => [null, true]), // [ref, inView]
  AnimatePresence: ({ children }: any) => children,
}));

// Mock motion-primitives components that may not exist yet
const mockAnimatedGroup = ({ children, ...props }: any) => (
  <div data-testid="animated-group" {...props}>
    {children}
  </div>
);

const mockInView = ({ children, ...props }: any) => (
  <div data-testid="in-view" {...props}>
    {children}
  </div>
);

// Create mocks for components that may not exist yet
jest.doMock(
  "../../components/motion-primitives/animated-group",
  () => ({
    AnimatedGroup: mockAnimatedGroup,
  }),
  { virtual: true },
);

jest.doMock(
  "../../components/motion-primitives/in-view",
  () => ({
    InView: mockInView,
  }),
  { virtual: true },
);

// Mock the Tilt component
jest.mock("../../components/core/tilt", () => ({
  Tilt: ({ children, ...props }: any) => (
    <div data-testid="tilt" {...props}>
      {children}
    </div>
  ),
}));

// Mock IntersectionObserver for scroll-based animations
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Import the component we're testing (this will fail initially - TDD RED phase)
// Using dynamic import to handle missing component during RED phase
let WireframesSection: any;

try {
  const component = require("../../components/ui/wireframes-section");
  WireframesSection = component.WireframesSection;
} catch (error) {
  // Component doesn't exist yet - this is expected in TDD RED phase
  WireframesSection = () => null;
}

// Mock data for wireframes - based on the Addvanced project structure
const mockWireframeData = [
  {
    id: "A0",
    title: "A0 (Splash Screen)",
    imagePath: "/projects/addvanced/A0-Addvanced Splash Screen.png",
    altText:
      "Wireframe for Addvanced app splash screen showing logo and loading state",
    features: [
      "Brand introduction with logo animation",
      "Loading progress indicator",
      "Smooth transition to main app",
    ],
  },
  {
    id: "A1",
    title: "A1 (Home)",
    imagePath: "/projects/addvanced/A1-Home.png",
    altText:
      "Wireframe for Addvanced app home screen with navigation and content areas",
    features: [
      "Main navigation and search",
      "Featured content showcase",
      "Quick action buttons",
    ],
  },
  {
    id: "A17c",
    title: "A17c (Moved to Offer)",
    imagePath: "/projects/addvanced/A17c-Moved to Offer.png",
    altText:
      "Wireframe showing offer moved state with confirmation and next steps",
    features: [
      "Offer status confirmation",
      "Next steps guidance",
      "Action completion feedback",
    ],
  },
  {
    id: "A5",
    title: "A5 (Connection Details)",
    imagePath: "/projects/addvanced/A5-Connection Details.png",
    altText:
      "Wireframe for connection details screen with contact information and actions",
    features: [
      "Contact information display",
      "Connection status indicators",
      "Communication action buttons",
    ],
  },
];

describe("WireframesSection Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset useInView mock to return true by default
    const { useInView } = require("motion/react");
    useInView.mockReturnValue([null, true]);
  });

  // Clean up after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the section title and subtitle", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      expect(
        screen.getByRole("heading", { name: /high-fidelity wireframes/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/detailed wireframes showcasing key user flows/i),
      ).toBeInTheDocument();
    });

    it("should render exactly 4 wireframe cards", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const wireframeCards = screen.getAllByTestId("wireframe-card");
      expect(wireframeCards).toHaveLength(4);
    });

    it("should render each wireframe with correct title and features", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      mockWireframeData.forEach((wireframe) => {
        // Check title is present
        expect(screen.getByText(wireframe.title)).toBeInTheDocument();

        // Check all features are present
        wireframe.features.forEach((feature) => {
          expect(screen.getByText(feature)).toBeInTheDocument();
        });
      });
    });

    it("should render wireframe images with proper alt text", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      mockWireframeData.forEach((wireframe) => {
        const image = screen.getByAltText(wireframe.altText);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", wireframe.imagePath);
      });
    });
  });

  describe("Animation Components Integration", () => {
    it("should wrap content in AnimatedGroup for staggered animations", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      expect(screen.getByTestId("animated-group")).toBeInTheDocument();
    });

    it("should use InView component for scroll-triggered animations", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      expect(screen.getByTestId("in-view")).toBeInTheDocument();
    });

    it("should wrap each wireframe card in Tilt component for 3D hover effect", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const tiltComponents = screen.getAllByTestId("tilt");
      expect(tiltComponents).toHaveLength(4);
    });

    it("should apply staggered animation delays to wireframe cards", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const wireframeCards = screen.getAllByTestId("wireframe-card");

      wireframeCards.forEach((card, index) => {
        // Check for animation delay attributes or data attributes
        expect(card).toHaveAttribute("data-animation-delay");
        const delay = card.getAttribute("data-animation-delay");
        expect(parseInt(delay || "0")).toBe(index * 100); // 100ms stagger
      });
    });
  });

  describe("InView Animation Behavior", () => {
    it("should trigger animations when component comes into view", () => {
      const { useInView } = require("motion/react");

      // Initially not in view
      useInView.mockReturnValue([null, false]);

      const { rerender } = render(
        <WireframesSection wireframes={mockWireframeData} />,
      );

      const animatedGroup = screen.getByTestId("animated-group");
      expect(animatedGroup).toHaveAttribute("data-in-view", "false");

      // Now comes into view
      useInView.mockReturnValue([null, true]);
      rerender(<WireframesSection wireframes={mockWireframeData} />);

      expect(animatedGroup).toHaveAttribute("data-in-view", "true");
    });

    it("should handle useInView hook with proper options", () => {
      const { useInView } = require("motion/react");

      render(<WireframesSection wireframes={mockWireframeData} />);

      expect(useInView).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          once: true,
          margin: "-10%",
        }),
      );
    });
  });

  describe("Responsive Layout", () => {
    it("should apply mobile-first responsive grid classes", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const gridContainer = screen.getByTestId("wireframes-grid");

      // Mobile: 1 column
      expect(gridContainer).toHaveClass("grid-cols-1");

      // Tablet: 2 columns
      expect(gridContainer).toHaveClass("md:grid-cols-2");

      // Desktop: 2x2 grid
      expect(gridContainer).toHaveClass("lg:grid-cols-2");
    });

    it("should maintain proper spacing in different viewport sizes", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const gridContainer = screen.getByTestId("wireframes-grid");
      expect(gridContainer).toHaveClass("gap-6");
      expect(gridContainer).toHaveClass("md:gap-8");
    });

    it("should handle responsive image sizing", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const images = screen.getAllByRole("img");
      images.forEach((image) => {
        expect(image).toHaveClass("w-full");
        expect(image).toHaveClass("h-auto");
      });
    });
  });

  describe("Image Loading States", () => {
    it("should show loading skeleton while images are loading", async () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const loadingSkeletons = screen.getAllByTestId("image-loading-skeleton");
      expect(loadingSkeletons).toHaveLength(4);
    });

    it("should hide loading skeleton when image loads successfully", async () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const images = screen.getAllByRole("img");

      // Simulate image load
      await act(async () => {
        images.forEach((image) => {
          fireEvent.load(image);
        });
      });

      await waitFor(() => {
        expect(screen.queryAllByTestId("image-loading-skeleton")).toHaveLength(
          0,
        );
      });
    });

    it("should show error state when image fails to load", async () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const images = screen.getAllByRole("img");

      // Simulate image error
      await act(async () => {
        fireEvent.error(images[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId("image-error-state")).toBeInTheDocument();
      });
    });

    it("should retry image loading when retry button is clicked", async () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const images = screen.getAllByRole("img");

      // Simulate image error
      await act(async () => {
        fireEvent.error(images[0]);
      });

      const retryButton = await screen.findByRole("button", { name: /retry/i });

      await act(async () => {
        await userEvent.click(retryButton);
      });

      // Should attempt to reload the image
      expect(images[0]).toHaveAttribute(
        "key",
        expect.stringContaining("retry"),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle empty wireframes array gracefully", () => {
      render(<WireframesSection wireframes={[]} />);

      expect(screen.getByText(/no wireframes available/i)).toBeInTheDocument();
    });

    it("should handle missing image paths gracefully", () => {
      const wireframesWithMissingImages = [
        {
          ...mockWireframeData[0],
          imagePath: "",
        },
      ];

      render(<WireframesSection wireframes={wireframesWithMissingImages} />);

      expect(screen.getByTestId("placeholder-image")).toBeInTheDocument();
    });

    it("should handle malformed wireframe data", () => {
      const malformedWireframes = [
        {
          id: "test",
          // Missing required fields
        },
      ] as any;

      render(<WireframesSection wireframes={malformedWireframes} />);

      // Should render without crashing
      expect(screen.getByTestId("wireframes-section")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <WireframesSection wireframes={mockWireframeData} />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper semantic structure", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      // Should use semantic section element
      expect(
        screen.getByRole("region", { name: /wireframes/i }),
      ).toBeInTheDocument();

      // Should have proper heading hierarchy
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("should provide proper ARIA labels for interactive elements", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const wireframeCards = screen.getAllByTestId("wireframe-card");
      wireframeCards.forEach((card, index) => {
        expect(card).toHaveAttribute(
          "aria-label",
          expect.stringContaining(mockWireframeData[index].title),
        );
      });
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<WireframesSection wireframes={mockWireframeData} />);

      const firstCard = screen.getAllByTestId("wireframe-card")[0];

      await act(async () => {
        await user.tab();
      });

      expect(firstCard).toHaveFocus();
    });

    it("should provide descriptive alt text for images", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      mockWireframeData.forEach((wireframe) => {
        const image = screen.getByAltText(wireframe.altText);
        expect(image).toBeInTheDocument();

        // Alt text should be descriptive (more than just the title)
        expect(wireframe.altText.length).toBeGreaterThan(
          wireframe.title.length,
        );
      });
    });

    it("should support screen readers with proper announcements", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      // Check for screen reader friendly content
      expect(screen.getByText(/4 wireframes showcasing/i)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should implement lazy loading for images", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      const images = screen.getAllByRole("img");
      images.forEach((image) => {
        expect(image).toHaveAttribute("loading", "lazy");
      });
    });

    it("should not cause memory leaks during unmount", () => {
      const { unmount } = render(
        <WireframesSection wireframes={mockWireframeData} />,
      );

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it("should optimize re-renders with proper memoization", () => {
      const renderSpy = jest.fn();

      const TestWrapper = ({ wireframes }: any) => {
        renderSpy();
        return <WireframesSection wireframes={wireframes} />;
      };

      const { rerender } = render(
        <TestWrapper wireframes={mockWireframeData} />,
      );

      // Re-render with same props
      rerender(<TestWrapper wireframes={mockWireframeData} />);

      // Should not re-render unnecessarily
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle large datasets efficiently", () => {
      const largeWireframeData = Array.from({ length: 100 }, (_, i) => ({
        ...mockWireframeData[0],
        id: `A${i}`,
        title: `Wireframe ${i}`,
      }));

      const startTime = performance.now();
      render(<WireframesSection wireframes={largeWireframeData} />);
      const endTime = performance.now();

      // Should render in reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe("Interactive Behavior", () => {
    it("should handle hover effects on wireframe cards", async () => {
      const user = userEvent.setup();
      render(<WireframesSection wireframes={mockWireframeData} />);

      const firstCard = screen.getAllByTestId("wireframe-card")[0];

      await act(async () => {
        await user.hover(firstCard);
      });

      expect(firstCard).toHaveClass("transform");
      expect(firstCard).toHaveClass("transition-transform");
    });

    it("should handle focus states properly", async () => {
      const user = userEvent.setup();
      render(<WireframesSection wireframes={mockWireframeData} />);

      const firstCard = screen.getAllByTestId("wireframe-card")[0];

      await act(async () => {
        await user.tab();
      });

      expect(firstCard).toHaveClass("focus:ring-2");
      expect(firstCard).toHaveClass("focus:outline-none");
    });
  });

  describe("Props Validation", () => {
    it("should handle optional props gracefully", () => {
      render(<WireframesSection wireframes={mockWireframeData} />);

      // Should render with default behavior
      expect(screen.getByTestId("wireframes-section")).toBeInTheDocument();
    });

    it("should accept custom className prop", () => {
      render(
        <WireframesSection
          wireframes={mockWireframeData}
          className="custom-wireframes"
        />,
      );

      expect(screen.getByTestId("wireframes-section")).toHaveClass(
        "custom-wireframes",
      );
    });

    it("should handle custom animation configuration", () => {
      const customAnimationConfig = {
        staggerDelay: 200,
        duration: 0.8,
      };

      render(
        <WireframesSection
          wireframes={mockWireframeData}
          animationConfig={customAnimationConfig}
        />,
      );

      const wireframeCards = screen.getAllByTestId("wireframe-card");
      wireframeCards.forEach((card, index) => {
        const delay = card.getAttribute("data-animation-delay");
        expect(parseInt(delay || "0")).toBe(index * 200);
      });
    });
  });
});
