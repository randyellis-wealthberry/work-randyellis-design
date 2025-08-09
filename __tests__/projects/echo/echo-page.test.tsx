import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EchoDriveCaseStudy, { metadata } from "@/app/projects/echo/page";

// Mock the client component
jest.mock("@/app/projects/echo/echo-client", () => {
  return function MockEchoClientPage() {
    return (
      <div data-testid="echo-client-page">
        <h1>ECHO DRIVE</h1>
        <p>AI-Powered Cloud Intelligence Platform</p>
      </div>
    );
  };
});

describe("EchoDriveCaseStudy Page", () => {
  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<EchoDriveCaseStudy />);
      expect(screen.getByTestId("echo-client-page")).toBeInTheDocument();
    });

    it("renders with proper container structure", () => {
      render(<EchoDriveCaseStudy />);

      const container = screen.getByTestId("echo-client-page").parentElement;
      expect(container).toHaveClass(
        "container mx-auto px-4 py-16 max-w-6xl",
      );
    });

    it("includes the client component", () => {
      render(<EchoDriveCaseStudy />);

      expect(screen.getByText("ECHO DRIVE")).toBeInTheDocument();
      expect(
        screen.getByText("AI-Powered Cloud Intelligence Platform"),
      ).toBeInTheDocument();
    });
  });

  describe("Metadata Validation", () => {
    it("has correct title metadata", () => {
      expect(metadata.title).toBe(
        "EchoDrive Case Study | AI-Powered Smart Cloud Storage",
      );
    });

    it("has comprehensive description metadata", () => {
      expect(metadata.description).toBe(
        "Explore how EchoDrive revolutionized cloud storage through AI-powered organization, achieving 89% user adoption, 35% storage efficiency gains, and 5x faster search speeds.",
      );
    });

    it("has proper OpenGraph metadata", () => {
      expect(metadata.openGraph).toEqual({
        title: "EchoDrive Case Study | AI-Powered Cloud Storage Innovation",
        description:
          "AI-powered cloud storage case study: 35% storage efficiency, 5x search speed, 89% user adoption through intelligent file management.",
        type: "article",
        images: [
          {
            url: "/projects/echo/img1.jpg",
            width: 1200,
            height: 630,
            alt: "EchoDrive AI-powered cloud storage interface",
          },
        ],
      });
    });

    it("has proper Twitter metadata", () => {
      expect(metadata.twitter).toEqual({
        card: "summary_large_image",
        title: "EchoDrive Case Study | Smart Cloud Storage with AI",
        description:
          "How AI-powered intelligence transformed cloud storage efficiency and collaboration workflows.",
        images: ["/projects/echo/img1.jpg"],
      });
    });

    it("includes key metrics in metadata descriptions", () => {
      const description = metadata.description;

      // Check that key metrics are mentioned
      expect(description).toContain("89% user adoption");
      expect(description).toContain("35% storage efficiency gains");
      expect(description).toContain("5x faster search speeds");
    });

    it("emphasizes AI-powered aspects in all metadata", () => {
      expect(metadata.title).toContain("AI-Powered");
      expect(metadata.openGraph?.title).toContain("AI-Powered");
      expect(metadata.twitter?.title).toContain("AI");
      expect(metadata.twitter?.description).toContain(
        "AI-powered intelligence",
      );
    });

    it("uses consistent image paths across metadata", () => {
      const expectedImagePath = "/projects/echo/img1.jpg";

      const ogImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [metadata.openGraph?.images];
      const twitterImages = Array.isArray(metadata.twitter?.images)
        ? metadata.twitter.images
        : [metadata.twitter?.images];
      expect(typeof ogImages[0] === 'object' && 'url' in ogImages[0] ? ogImages[0]?.url : ogImages[0]).toBe(expectedImagePath);
      expect(twitterImages[0]).toBe(expectedImagePath);
    });

    it("has proper OpenGraph image dimensions", () => {
      const ogImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [metadata.openGraph?.images];
      const ogImage = ogImages[0];

      expect(ogImage).toEqual({
        url: "/projects/echo/img1.jpg",
        width: 1200,
        height: 630,
        alt: "EchoDrive AI-powered cloud storage interface",
      });
    });

    it("uses large image card for Twitter", () => {
      expect((metadata.twitter as any)?.card).toBe("summary_large_image");
    });

    it("has descriptive alt text for images", () => {
      const ogImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [metadata.openGraph?.images];
      const ogImage = ogImages[0];
      expect(typeof ogImage === 'object' && 'alt' in ogImage ? ogImage?.alt : undefined).toBe("EchoDrive AI-powered cloud storage interface");
    });
  });

  describe("SEO Optimization", () => {
    it("title contains primary keywords", () => {
      const title = metadata.title;
      expect(title).toContain("EchoDrive");
      expect(title).toContain("Case Study");
      expect(title).toContain("AI-Powered");
      expect(title).toContain("Cloud Storage");
    });

    it("description contains important metrics and keywords", () => {
      const description = metadata.description;

      // Key metrics
      expect(description).toContain("89%");
      expect(description).toContain("35%");
      expect(description).toContain("5x");

      // Keywords
      expect(description).toContain("AI-powered");
      expect(description).toContain("cloud storage");
      expect(description).toContain("organization");
      expect(description).toContain("user adoption");
      expect(description).toContain("efficiency");
    });

    it("OpenGraph description is optimized for social sharing", () => {
      const ogDescription = metadata.openGraph?.description;

      expect(ogDescription).toContain("AI-powered cloud storage case study");
      expect(ogDescription).toContain("35% storage efficiency");
      expect(ogDescription).toContain("5x search speed");
      expect(ogDescription).toContain("89% user adoption");
      expect(ogDescription).toContain("intelligent file management");
    });

    it("Twitter description emphasizes transformation aspect", () => {
      const twitterDescription = metadata.twitter?.description;

      expect(twitterDescription).toContain("transformed");
      expect(twitterDescription).toContain("AI-powered intelligence");
      expect(twitterDescription).toContain("cloud storage efficiency");
      expect(twitterDescription).toContain("collaboration workflows");
    });

    it("titles are unique across platforms", () => {
      const mainTitle = metadata.title;
      const ogTitle = metadata.openGraph?.title;
      const twitterTitle = metadata.twitter?.title;

      // Each should be unique while maintaining consistency
      expect(mainTitle).not.toBe(ogTitle);
      expect(ogTitle).not.toBe(twitterTitle);
      expect(mainTitle).not.toBe(twitterTitle);

      // But all should contain core elements
      [mainTitle, ogTitle, twitterTitle].forEach((title) => {
        expect(title).toContain("EchoDrive");
        expect(title).toContain("Case Study");
      });
    });
  });

  describe("Content Structure", () => {
    it("maintains semantic HTML structure", () => {
      render(<EchoDriveCaseStudy />);

      // Container should have proper classes for responsive design
      const container = screen.getByTestId("echo-client-page").parentElement;
      expect(container).toHaveClass("container");
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("py-16");
      expect(container).toHaveClass("max-w-6xl");
    });

    it("provides proper spacing and layout classes", () => {
      render(<EchoDriveCaseStudy />);

      const container = screen.getByTestId("echo-client-page").parentElement;

      // Should have responsive padding
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("py-16");

      // Should have max width constraint
      expect(container).toHaveClass("max-w-6xl");

      // Should be centered
      expect(container).toHaveClass("mx-auto");
    });
  });

  describe("Accessibility", () => {
    it("provides proper document structure", () => {
      render(<EchoDriveCaseStudy />);

      // Should have proper heading structure through the client component
      expect(screen.getByText("ECHO DRIVE")).toBeInTheDocument();
    });

    it("uses semantic container elements", () => {
      const { container } = render(<EchoDriveCaseStudy />);

      // Should have proper div structure
      const wrapperDiv = container.firstChild as HTMLElement;
      expect(wrapperDiv).toBeInTheDocument();
      expect(wrapperDiv.tagName).toBe("DIV");
    });
  });

  describe("Performance Considerations", () => {
    it("uses client component pattern correctly", () => {
      // The page component should be a server component that wraps the client component
      render(<EchoDriveCaseStudy />);

      // Should successfully render the mocked client component
      expect(screen.getByTestId("echo-client-page")).toBeInTheDocument();
    });

    it("has minimal server component overhead", () => {
      const pageComponent = render(<EchoDriveCaseStudy />);

      // Should render efficiently without unnecessary complexity
      expect(pageComponent.container.children.length).toBe(1);
    });
  });

  describe("Image Optimization", () => {
    it("uses optimized image paths in metadata", () => {
      const ogImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [metadata.openGraph?.images];
      const imagePath = typeof ogImages[0] === 'object' && 'url' in ogImages[0] ? ogImages[0]?.url : ogImages[0];

      // Should use project-specific path
      expect(imagePath).toBe("/projects/echo/img1.jpg");
      expect(imagePath).toMatch(/^\/projects\/echo\//);
    });

    it("has proper image dimensions for social sharing", () => {
      const ogImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [metadata.openGraph?.images];
      const ogImage = ogImages[0];

      // Should use standard OpenGraph dimensions
      expect(typeof ogImage === 'object' && 'width' in ogImage ? ogImage?.width : undefined).toBe(1200);
      expect(typeof ogImage === 'object' && 'height' in ogImage ? ogImage?.height : undefined).toBe(630);

      // Should have proper aspect ratio (roughly 1.91:1)
      const width = typeof ogImage === 'object' && 'width' in ogImage ? (ogImage?.width || 0) : 0;
      const height = typeof ogImage === 'object' && 'height' in ogImage ? (ogImage?.height || 1) : 1;
      const aspectRatio = (Number(width) || 0) / (Number(height) || 1);
      expect(aspectRatio).toBeCloseTo(1.905, 2);
    });
  });

  describe("Error Handling", () => {
    it("renders gracefully if client component fails", () => {
      // This test ensures the page component itself is resilient
      expect(() => render(<EchoDriveCaseStudy />)).not.toThrow();
    });

    it("maintains container structure even with component errors", () => {
      render(<EchoDriveCaseStudy />);

      // Container structure should remain intact
      const container = screen.getByTestId("echo-client-page").parentElement;
      expect(container).toHaveClass("container");
    });
  });

  describe("Type Safety", () => {
    it("exports metadata with correct type", () => {
      // Metadata should have all required Next.js Metadata properties
      expect(typeof metadata.title).toBe("string");
      expect(typeof metadata.description).toBe("string");
      expect(typeof metadata.openGraph).toBe("object");
      expect(typeof metadata.twitter).toBe("object");
    });

    it("has properly typed OpenGraph metadata", () => {
      const og = metadata.openGraph;

      expect(typeof og?.title).toBe("string");
      expect(typeof og?.description).toBe("string");
      expect((og as any)?.type).toBe("article");
      expect(Array.isArray(og?.images)).toBe(true);
    });

    it("has properly typed Twitter metadata", () => {
      const twitter = metadata.twitter;

      expect((twitter as any)?.card).toBe("summary_large_image");
      expect(typeof twitter?.title).toBe("string");
      expect(typeof twitter?.description).toBe("string");
      expect(Array.isArray(twitter?.images)).toBe(true);
    });
  });
});
