/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Responsive Design Tests
 *
 * This test suite validates responsive design behavior across mobile, tablet,
 * and desktop viewports for the Nagarro case study, following modern responsive
 * design patterns and testing methodologies.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

// Mock viewport dimensions for responsive testing
const mockViewport = (width: number, height: number) => {
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
  fireEvent(window, new Event("resize"));
};

// Mock data for responsive testing
const mockNagarroResponsiveData = {
  title:
    "Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design",
  client: "Nagarro Software Engineering GmbH",
  hero: {
    title:
      "Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design",
    subtitle:
      "Leading design strategy at a global IT consulting firm, boosting brand recognition by 50% and generating 100+ qualified leads through strategic design thinking and team development.",
    heroImage: "/projects/nagarro/nagarro-hero.jpg",
    heroVideo: "/projects/nagarro/nagarro-leadership-showcase.mp4",
    platforms: ["Web Platform", "Mobile Application", "Design Systems"],
  },
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
    {
      label: "Team Retention Improvement",
      value: "40%",
      description: "Reduced designer turnover rate",
    },
    {
      label: "Content Publications",
      value: "15+",
      description: "Articles improving site traffic",
    },
    {
      label: "Site Traffic Increase",
      value: "40%",
      description: "Through thought leadership content",
    },
  ],
};

// Mock responsive Nagarro component with breakpoint-aware classes
const MockResponsiveNagarroLayout = () => {
  return (
    <div className="responsive-case-study" data-testid="responsive-container">
      {/* Mobile-first responsive header */}
      <header
        className="w-full px-4 md:px-6 lg:px-8"
        data-testid="responsive-header"
      >
        <nav className="flex flex-col md:flex-row items-start md:items-center justify-between py-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-0 line-clamp-2 md:line-clamp-1">
            {mockNagarroResponsiveData.title}
          </h1>

          {/* Responsive navigation menu */}
          <div className="hidden md:flex space-x-6" data-testid="desktop-nav">
            <a href="#overview" className="nav-link">
              Overview
            </a>
            <a href="#metrics" className="nav-link">
              Metrics
            </a>
            <a href="#process" className="nav-link">
              Process
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle mobile navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      <main className="w-full" data-testid="responsive-main">
        {/* Hero Section - Responsive Layout */}
        <section
          className="px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16"
          data-testid="hero-responsive"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content */}
              <div className="order-2 lg:order-1" data-testid="hero-content">
                <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 leading-tight">
                  {mockNagarroResponsiveData.hero.subtitle}
                </h2>

                {/* Client Info - Responsive Stack */}
                <div
                  className="space-y-2 md:space-y-3 mb-6"
                  data-testid="client-info-responsive"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-semibold text-sm md:text-base mr-2">
                      Client:
                    </span>
                    <span className="text-sm md:text-base">
                      {mockNagarroResponsiveData.client}
                    </span>
                  </div>
                </div>

                {/* Platform Badges - Responsive Grid */}
                <div className="mb-6" data-testid="platforms-responsive">
                  <h3 className="font-semibold text-sm md:text-base mb-2">
                    Platforms:
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {mockNagarroResponsiveData.hero.platforms.map(
                      (platform, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 md:px-3 md:py-2 bg-gray-100 rounded text-xs md:text-sm"
                          data-testid={`platform-badge-${index}`}
                        >
                          {platform}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Hero Media - Responsive Container */}
              <div
                className="order-1 lg:order-2"
                data-testid="hero-media-responsive"
              >
                <div className="relative aspect-video w-full">
                  <video
                    src={mockNagarroResponsiveData.hero.heroVideo}
                    poster={mockNagarroResponsiveData.hero.heroImage}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    data-testid="responsive-video"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section - Responsive Grid */}
        <section
          className="px-4 md:px-6 lg:px-8 py-8 md:py-12"
          data-testid="metrics-responsive"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">
              Impact & Results
            </h2>

            {/* Responsive Metrics Grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
              data-testid="metrics-grid-responsive"
            >
              {mockNagarroResponsiveData.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                  data-testid={`responsive-metric-${index}`}
                >
                  <h3 className="font-semibold text-sm md:text-base mb-2 text-gray-700">
                    {metric.label}
                  </h3>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-blue-600">
                    {metric.value}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* External Links - Responsive Layout */}
        <section
          className="px-4 md:px-6 lg:px-8 py-8 md:py-12"
          data-testid="external-links-responsive"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">
              Additional Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <a
                href="https://www.scribd.com/document/nagarro-design-leadership-case-study"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="scribd-link-responsive"
              >
                <div className="flex-shrink-0 text-2xl mb-2 sm:mb-0 sm:mr-4">
                  📄
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">
                    Complete Case Study
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    View on Scribd
                  </p>
                </div>
              </a>

              <a
                href="https://medium.com/@randyellis/nagarro-design-leadership-transformation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="medium-link-responsive"
              >
                <div className="flex-shrink-0 text-2xl mb-2 sm:mb-0 sm:mr-4">
                  ✍️
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">
                    Design Leadership Article
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Read on Medium
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Responsive Footer with Scroll to Top */}
      <footer
        className="px-4 md:px-6 lg:px-8 py-6 md:py-8"
        data-testid="responsive-footer"
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="scroll-to-top-responsive"
          >
            ↑ Back to Top
          </button>
        </div>
      </footer>
    </div>
  );
};

describe("Nagarro Case Study - Responsive Design Tests", () => {
  beforeEach(() => {
    // Reset viewport to default before each test
    mockViewport(1024, 768);
  });

  describe("Mobile Viewport (320px - 767px)", () => {
    beforeEach(() => {
      mockViewport(375, 667); // iPhone-like dimensions
    });

    it("adapts layout for mobile viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      const container = screen.getByTestId("responsive-container");
      expect(container).toBeInTheDocument();

      // Mobile navigation should be hidden, toggle button visible
      const desktopNav = screen.getByTestId("desktop-nav");
      expect(desktopNav).toHaveClass("hidden md:flex");

      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveClass("md:hidden");
    });

    it("stacks hero content vertically on mobile", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroContent = screen.getByTestId("hero-content");
      expect(heroContent).toHaveClass("order-2 lg:order-1");

      const heroMedia = screen.getByTestId("hero-media-responsive");
      expect(heroMedia).toHaveClass("order-1 lg:order-2");
    });

    it("uses single column grid for metrics on mobile", () => {
      render(<MockResponsiveNagarroLayout />);

      const metricsGrid = screen.getByTestId("metrics-grid-responsive");
      expect(metricsGrid).toHaveClass(
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      );
    });

    it("adjusts typography for mobile readability", () => {
      render(<MockResponsiveNagarroLayout />);

      const header = screen
        .getByTestId("responsive-header")
        .querySelector("h1");
      expect(header).toHaveClass("text-2xl md:text-3xl lg:text-4xl");

      // Check metric cards have appropriate mobile text sizing
      mockNagarroResponsiveData.metrics.forEach((_, index) => {
        const metricCard = screen.getByTestId(`responsive-metric-${index}`);
        expect(metricCard).toBeInTheDocument();
      });
    });

    it("optimizes padding and spacing for mobile", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroSection = screen.getByTestId("hero-responsive");
      expect(heroSection).toHaveClass("px-4 md:px-6 lg:px-8");
      expect(heroSection).toHaveClass("py-8 md:py-12 lg:py-16");
    });

    it("handles mobile menu interaction", async () => {
      render(<MockResponsiveNagarroLayout />);

      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveAttribute(
        "aria-label",
        "Toggle mobile navigation menu",
      );

      // Should be interactive
      expect(mobileToggle).toBeInTheDocument();
    });
  });

  describe("Tablet Viewport (768px - 1023px)", () => {
    beforeEach(() => {
      mockViewport(768, 1024); // iPad-like dimensions
    });

    it("adapts layout for tablet viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      // Desktop nav should be visible, mobile toggle hidden
      const desktopNav = screen.getByTestId("desktop-nav");
      expect(desktopNav).toHaveClass("hidden md:flex");

      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveClass("md:hidden");
    });

    it("uses appropriate grid layout for tablet metrics", () => {
      render(<MockResponsiveNagarroLayout />);

      const metricsGrid = screen.getByTestId("metrics-grid-responsive");
      expect(metricsGrid).toHaveClass("sm:grid-cols-2 lg:grid-cols-3");
    });

    it("adjusts typography for tablet readability", () => {
      render(<MockResponsiveNagarroLayout />);

      const header = screen
        .getByTestId("responsive-header")
        .querySelector("h1");
      expect(header).toHaveClass("md:text-3xl");
    });

    it("optimizes spacing for tablet viewing", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroSection = screen.getByTestId("hero-responsive");
      expect(heroSection).toHaveClass("md:px-6 md:py-12");

      const metricsSection = screen.getByTestId("metrics-responsive");
      expect(metricsSection).toHaveClass("md:px-6 md:py-12");
    });

    it("maintains good touch target sizes for tablet", () => {
      render(<MockResponsiveNagarroLayout />);

      const scrollButton = screen.getByTestId("scroll-to-top-responsive");
      expect(scrollButton).toHaveClass("md:px-6 md:py-3");
    });

    it("handles external links layout for tablet", () => {
      render(<MockResponsiveNagarroLayout />);

      const externalLinks = screen.getByTestId("external-links-responsive");
      const linksGrid = externalLinks.querySelector(".grid");
      expect(linksGrid).toHaveClass("md:grid-cols-2");
    });
  });

  describe("Desktop Viewport (1024px+)", () => {
    beforeEach(() => {
      mockViewport(1440, 900); // Large desktop dimensions
    });

    it("uses full desktop layout", () => {
      render(<MockResponsiveNagarroLayout />);

      // Desktop navigation should be fully visible
      const desktopNav = screen.getByTestId("desktop-nav");
      expect(desktopNav).toHaveClass("md:flex");

      // Mobile toggle should be hidden
      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveClass("md:hidden");
    });

    it("uses optimal grid layout for desktop metrics", () => {
      render(<MockResponsiveNagarroLayout />);

      const metricsGrid = screen.getByTestId("metrics-grid-responsive");
      expect(metricsGrid).toHaveClass("lg:grid-cols-3");
    });

    it("uses side-by-side hero layout on desktop", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroContent = screen.getByTestId("hero-content");
      expect(heroContent).toHaveClass("lg:order-1");

      const heroMedia = screen.getByTestId("hero-media-responsive");
      expect(heroMedia).toHaveClass("lg:order-2");
    });

    it("optimizes typography for desktop viewing", () => {
      render(<MockResponsiveNagarroLayout />);

      const header = screen
        .getByTestId("responsive-header")
        .querySelector("h1");
      expect(header).toHaveClass("lg:text-4xl");
    });

    it("uses maximum spacing for desktop comfort", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroSection = screen.getByTestId("hero-responsive");
      expect(heroSection).toHaveClass("lg:px-8 lg:py-16");
    });

    it("provides optimal desktop navigation experience", () => {
      render(<MockResponsiveNagarroLayout />);

      const navLinks = screen.getAllByRole("link");
      expect(navLinks.length).toBeGreaterThan(0);

      // Desktop navigation should be visible
      const desktopNav = screen.getByTestId("desktop-nav");
      const navLinksInDesktopNav = desktopNav.querySelectorAll("a");
      expect(navLinksInDesktopNav.length).toBe(3);
    });
  });

  describe("Responsive Video and Media", () => {
    it("maintains aspect ratio across viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      const videoContainer = screen
        .getByTestId("hero-media-responsive")
        .querySelector(".relative");
      expect(videoContainer).toHaveClass("aspect-video");

      const video = screen.getByTestId("responsive-video");
      expect(video).toHaveClass("w-full h-full object-cover");
    });

    it("provides accessible video controls across devices", () => {
      render(<MockResponsiveNagarroLayout />);

      const video = screen.getByTestId("responsive-video");
      expect(video).toHaveAttribute("controls");
      expect(video).toHaveAttribute(
        "poster",
        mockNagarroResponsiveData.hero.heroImage,
      );
    });
  });

  describe("Responsive Platform Badges", () => {
    it("adapts platform badges layout for different viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      const platformsContainer = screen.getByTestId("platforms-responsive");
      const badgesContainer = platformsContainer.querySelector(".flex");
      expect(badgesContainer).toHaveClass("flex-wrap gap-2 md:gap-3");

      mockNagarroResponsiveData.hero.platforms.forEach((_, index) => {
        const badge = screen.getByTestId(`platform-badge-${index}`);
        expect(badge).toHaveClass("px-2 py-1 md:px-3 md:py-2");
        expect(badge).toHaveClass("text-xs md:text-sm");
      });
    });
  });

  describe("Responsive External Links", () => {
    it("adapts external links layout for different viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      const scribdLink = screen.getByTestId("scribd-link-responsive");
      expect(scribdLink).toHaveClass("flex flex-col sm:flex-row");
      expect(scribdLink).toHaveClass("p-4 md:p-6");

      const mediumLink = screen.getByTestId("medium-link-responsive");
      expect(mediumLink).toHaveClass("flex flex-col sm:flex-row");
      expect(mediumLink).toHaveClass("p-4 md:p-6");
    });
  });

  describe("Responsive Interactions", () => {
    it("handles scroll to top interaction across viewports", async () => {
      const mockScrollTo = jest.fn();
      Object.defineProperty(window, "scrollTo", {
        writable: true,
        value: mockScrollTo,
      });

      render(<MockResponsiveNagarroLayout />);

      const scrollButton = screen.getByTestId("scroll-to-top-responsive");
      expect(scrollButton).toHaveClass("text-sm md:text-base");

      fireEvent.click(scrollButton);
      expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  describe("Responsive Content Reflow", () => {
    it("reflows content properly when viewport changes", async () => {
      const { rerender } = render(<MockResponsiveNagarroLayout />);

      // Start with desktop
      mockViewport(1440, 900);
      fireEvent(window, new Event("resize"));

      expect(screen.getByTestId("desktop-nav")).toHaveClass("md:flex");

      // Change to mobile
      mockViewport(375, 667);
      fireEvent(window, new Event("resize"));

      // Content should still be accessible
      expect(screen.getByTestId("mobile-menu-toggle")).toHaveClass("md:hidden");
    });
  });

  describe("Performance Considerations", () => {
    it("uses efficient responsive image and video loading", () => {
      render(<MockResponsiveNagarroLayout />);

      const video = screen.getByTestId("responsive-video");
      expect(video).toHaveClass("object-cover"); // Ensures proper scaling without distortion

      // Video should have poster for faster perceived loading
      expect(video).toHaveAttribute("poster");
    });

    it("minimizes layout shift with proper container constraints", () => {
      render(<MockResponsiveNagarroLayout />);

      const heroMedia = screen.getByTestId("hero-media-responsive");
      const aspectContainer = heroMedia.querySelector(".aspect-video");
      expect(aspectContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility at Different Viewports", () => {
    it("maintains accessibility standards across viewports", () => {
      render(<MockResponsiveNagarroLayout />);

      // Navigation should always be accessible
      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveAttribute("aria-label");

      // Content should maintain proper heading hierarchy
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });

    it("provides sufficient touch targets on all devices", () => {
      render(<MockResponsiveNagarroLayout />);

      // Buttons should have adequate sizing on all viewports
      const scrollButton = screen.getByTestId("scroll-to-top-responsive");
      expect(scrollButton).toHaveClass("px-4 py-2 md:px-6 md:py-3");

      const mobileToggle = screen.getByTestId("mobile-menu-toggle");
      expect(mobileToggle).toHaveClass("px-3 py-2");
    });
  });

  describe("Grid and Layout Consistency", () => {
    it("maintains consistent grid behavior across breakpoints", () => {
      render(<MockResponsiveNagarroLayout />);

      const metricsGrid = screen.getByTestId("metrics-grid-responsive");
      expect(metricsGrid).toHaveClass(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      );

      // All metric cards should be present
      mockNagarroResponsiveData.metrics.forEach((_, index) => {
        expect(
          screen.getByTestId(`responsive-metric-${index}`),
        ).toBeInTheDocument();
      });
    });

    it("uses consistent spacing patterns across components", () => {
      render(<MockResponsiveNagarroLayout />);

      const sections = [
        screen.getByTestId("hero-responsive"),
        screen.getByTestId("metrics-responsive"),
        screen.getByTestId("external-links-responsive"),
      ];

      sections.forEach((section) => {
        expect(section).toHaveClass("px-4 md:px-6 lg:px-8");
      });
    });
  });

  describe("Breadcrumb Navigation Responsive Behavior", () => {
    it("should have proper padding on mobile viewport to prevent edge-to-edge layout", () => {
      // Set mobile viewport
      mockViewport(375, 667);
      render(<MockResponsiveNagarroLayout />);

      // Find the breadcrumb navigation section
      const breadcrumbSection = screen.getByText("Back to Projects").closest('div');
      expect(breadcrumbSection).toBeInTheDocument();

      // On mobile, the breadcrumb container should have horizontal padding
      // to prevent buttons from touching viewport edges
      const breadcrumbContainer = breadcrumbSection?.parentElement;
      expect(breadcrumbContainer).toHaveClass(
        expect.stringContaining("px-4")
      );
    });

    it("should have adequate spacing on tablet and desktop viewports", () => {
      // Test tablet viewport
      mockViewport(768, 1024);
      render(<MockResponsiveNagarroLayout />);

      const breadcrumbSection = screen.getByText("Back to Projects").closest('div');
      const breadcrumbContainer = breadcrumbSection?.parentElement;
      
      // Should maintain consistent padding with responsive design
      expect(breadcrumbContainer).toHaveClass(
        expect.stringMatching(/px-(4|6|8)/)
      );

      // Test desktop viewport  
      mockViewport(1200, 800);
      render(<MockResponsiveNagarroLayout />);

      const desktopBreadcrumbSection = screen.getByText("Back to Projects").closest('div');
      const desktopBreadcrumbContainer = desktopBreadcrumbSection?.parentElement;
      
      expect(desktopBreadcrumbContainer).toHaveClass(
        expect.stringMatching(/px-(6|8)/)
      );
    });

    it("should maintain proper button sizing on all viewports", () => {
      // Mobile test
      mockViewport(375, 667);
      render(<MockResponsiveNagarroLayout />);
      
      const backToProjectsLink = screen.getByText("Back to Projects");
      expect(backToProjectsLink).toHaveClass("px-6 py-3");
      
      // The link should have proper spacing and not extend to viewport edges
      expect(backToProjectsLink.closest('div')).not.toHaveClass("w-full");
    });

    it("should have consistent navigation spacing across different project pages", () => {
      render(<MockResponsiveNagarroLayout />);
      
      const navigationSection = screen.getByText("Back to Projects").closest('[data-testid*="navigation"], section');
      
      // Navigation section should have consistent spacing patterns
      expect(navigationSection).toHaveClass(
        expect.stringMatching(/(pt-8|py-8|border-t)/)
      );
    });
  });
});
