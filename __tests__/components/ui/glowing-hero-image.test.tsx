import { render, screen } from "@testing-library/react";
import { GlowingHeroImage } from "@/components/ui/glowing-hero-image";
import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock GlowEffect component
jest.mock("@/components/motion-primitives/glow-effect", () => ({
  GlowEffect: ({ className, ...props }: any) => (
    <div data-testid="glow-effect" className={className} {...props} />
  ),
}));

describe("GlowingHeroImage", () => {
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
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toBeInTheDocument();
      // Should have responsive width classes
      expect(innerContainer).toHaveClass("w-full");
      expect(innerContainer).toHaveClass("max-w-sm");
      expect(innerContainer).toHaveClass("mx-auto");
    });

    it("should render with proper responsive classes for tablet viewport (768px-1024px)", () => {
      setViewportWidth(768); // iPad viewport
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toBeInTheDocument();
      // Should have tablet-specific max-width
      expect(innerContainer).toHaveClass("md:max-w-2xl");
    });

    it("should render with proper responsive classes for desktop viewport (1024px-1440px)", () => {
      setViewportWidth(1024); // Desktop viewport
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toBeInTheDocument();
      // Should have desktop-specific max-width
      expect(innerContainer).toHaveClass("lg:max-w-4xl");
    });

    it("should render with proper responsive classes for large desktop viewport (>1440px)", () => {
      setViewportWidth(1440); // Large desktop viewport
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toBeInTheDocument();
      // Should have large desktop-specific max-width
      expect(innerContainer).toHaveClass("xl:max-w-5xl");
    });

    it("should maintain aspect ratio across all viewports", () => {
      const viewports = [375, 768, 1024, 1440];

      viewports.forEach((width) => {
        setViewportWidth(width);
        const { container } = render(
          <GlowingHeroImage
            src="/images/projects/metis/hero-banner-metis.jpg"
            alt="Test Hero Image"
          />,
        );

        const innerContainer = container.querySelector(
          ".relative.aspect-\\[16\\/4\\.5\\]",
        );

        expect(innerContainer).toHaveClass("aspect-[16/4.5]");
      });
    });

    it("should have mx-auto class for centering", () => {
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toHaveClass("mx-auto");
    });

    it("should not have fixed width that causes overflow", () => {
      setViewportWidth(375); // Small mobile viewport
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      // Should NOT have fixed width class like max-w-5xl without responsive breakpoints
      expect(innerContainer).not.toHaveClass("max-w-5xl");
    });

    it("should properly center in tablet viewports with correct max-width", () => {
      setViewportWidth(768); // Tablet viewport where the issue was occurring
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\]",
      );

      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass("mx-auto"); // Centering
      expect(innerContainer).toHaveClass("md:max-w-2xl"); // Appropriate size for tablet
      expect(innerContainer).toHaveClass("w-full"); // Full width within constraints
    });
  });

  describe("Content Rendering", () => {
    it("should render the hero image", () => {
      render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const image = screen.getByAltText("Test Hero Image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "/images/projects/metis/hero-banner-metis.jpg",
      );
    });

    it("should render with glow effect", () => {
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      const glowEffect = container.querySelector('[data-testid="glow-effect"]');
      expect(glowEffect).toBeInTheDocument();
    });

    it("should have proper container structure", () => {
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
        />,
      );

      // Outer container
      const outerContainer = container.querySelector(".relative.mx-auto.mb-8");
      expect(outerContainer).toBeInTheDocument();

      // Inner container with responsive classes
      const innerContainer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\].w-full",
      );
      expect(innerContainer).toBeInTheDocument();

      // Content layer
      const contentLayer = container.querySelector(
        ".relative.aspect-\\[16\\/4\\.5\\].w-full.overflow-hidden.rounded-2xl",
      );
      expect(contentLayer).toBeInTheDocument();
    });
  });

  describe("Container Classes", () => {
    it("should apply custom containerClassName", () => {
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
          containerClassName="max-w-4xl"
        />,
      );

      const outerContainer = container.querySelector(".relative.mx-auto.mb-8");
      expect(outerContainer).toHaveClass("max-w-4xl");
    });

    it("should have proper image styling classes", () => {
      const { container } = render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
          className="custom-image-class"
        />,
      );

      const image = screen.getByAltText("Test Hero Image");
      expect(image).toHaveClass("object-cover");
      expect(image).toHaveClass("custom-image-class");
    });
  });

  describe("Props Handling", () => {
    it("should handle all prop variations correctly", () => {
      render(
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
          priority={true}
          sizes="(max-width: 768px) 100vw, 80vw"
          glowColors={["#ff0000", "#00ff00"]}
          glowMode="pulse"
          glowBlur="strong"
          glowScale={1.1}
        />,
      );

      const image = screen.getByAltText("Test Hero Image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("sizes", "(max-width: 768px) 100vw, 80vw");
    });
  });
});
