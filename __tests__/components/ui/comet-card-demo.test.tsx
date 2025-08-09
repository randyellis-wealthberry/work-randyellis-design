import { render, screen } from "@testing-library/react";
import { CometCardDemo } from "@/components/ui/comet-card-demo";
import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Motion components
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  useMotionValue: () => ({ set: jest.fn() }),
  useSpring: (value: any) => value,
  useTransform: () => "",
  useMotionTemplate: () => "",
}));

describe("CometCardDemo", () => {
  // Helper function to set viewport width
  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event("resize"));
  };

  describe("Responsive Behavior", () => {
    it("should render with proper responsive classes for mobile viewport (<640px)", () => {
      setViewportWidth(375); // iPhone viewport
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      expect(cardWrapper).toBeInTheDocument();
      // Should have responsive width classes
      expect(cardWrapper).toHaveClass("w-full");
      expect(cardWrapper).toHaveClass("max-w-sm");
    });

    it("should render with proper responsive classes for tablet viewport (768px-1024px)", () => {
      setViewportWidth(768); // iPad viewport
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      expect(cardWrapper).toBeInTheDocument();
      // Should have tablet-specific max-width
      expect(cardWrapper).toHaveClass("md:max-w-md");
    });

    it("should render with proper responsive classes for desktop viewport (>1024px)", () => {
      setViewportWidth(1440); // Desktop viewport
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      expect(cardWrapper).toBeInTheDocument();
      // Should have desktop-specific max-width
      expect(cardWrapper).toHaveClass("lg:max-w-lg");
    });

    it("should maintain aspect ratio across all viewports", () => {
      const viewports = [375, 768, 1024, 1440];

      viewports.forEach((width) => {
        setViewportWidth(width);
        const { container } = render(<CometCardDemo />);
        const cardWrapper = container.querySelector(
          ".relative.aspect-\\[3\\/4\\]",
        );

        expect(cardWrapper).toHaveClass("aspect-[3/4]");
      });
    });

    it("should have mx-auto class for centering", () => {
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      expect(cardWrapper).toHaveClass("mx-auto");
    });

    it("should not have fixed width that causes overflow", () => {
      setViewportWidth(375); // Small mobile viewport
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      // Should NOT have fixed width class like w-96
      expect(cardWrapper).not.toHaveClass("w-96");
    });
  });

  describe("Content Rendering", () => {
    it("should render the METIS player card image", () => {
      render(<CometCardDemo />);
      const image = screen.getByAltText("METIS Player Card");

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "/images/projects/metis/playercard-metis.png",
      );
    });

    it("should have proper cursor and overflow styles", () => {
      const { container } = render(<CometCardDemo />);
      const cardWrapper = container.querySelector(
        ".relative.aspect-\\[3\\/4\\]",
      );

      expect(cardWrapper).toHaveClass("cursor-pointer");
      expect(cardWrapper).toHaveClass("rounded-2xl");
      expect(cardWrapper).toHaveClass("overflow-hidden");
    });
  });

  describe("Container Behavior", () => {
    it("should be wrapped in CometCard component", () => {
      const { container } = render(<CometCardDemo />);
      // CometCard adds perspective-distant and transform-3d classes
      const cometCardWrapper = container.querySelector(
        ".perspective-distant.transform-3d",
      );

      expect(cometCardWrapper).toBeInTheDocument();
    });

    it("should hide last child div as per className prop", () => {
      const { container } = render(<CometCardDemo />);
      const cometCardElement = container.firstElementChild;

      expect(cometCardElement).toHaveClass("[&>div>div:last-child]:hidden");
    });
  });
});
