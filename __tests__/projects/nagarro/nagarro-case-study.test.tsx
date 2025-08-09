/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Component Functionality Tests
 *
 * This test suite validates the case study layout components and their integration
 * for the Nagarro project, following the existing CaseStudyLayout patterns from
 * the Echo project and case-study-layout.test.tsx.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock case study layout components (TDD - components don't exist yet)
const mockNagarroDataForCaseStudy = {
  title:
    "Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design",
  client: "Nagarro Software Engineering GmbH",
  timeline: "Mar 2022 - Oct 2022 (8 months)",
  platforms: ["Web Platform", "Mobile Application", "Design Systems"],
  hero: {
    title:
      "Nagarro Design Leadership: Transforming IT Consulting Through Strategic Design",
    subtitle:
      "Leading design strategy at a global IT consulting firm, boosting brand recognition by 50% and generating 100+ qualified leads through strategic design thinking and team development.",
    client: "Nagarro Software Engineering GmbH",
    timeline: "Mar 2022 - Oct 2022 (8 months)",
    platforms: ["Web Platform", "Mobile Application", "Design Systems"],
    heroImage: "/projects/nagarro/nagarro-hero.jpg",
    heroVideo: "/projects/nagarro/nagarro-leadership-showcase.mp4",
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
  sections: [
    {
      id: "challenge",
      title: "The Challenge",
      content:
        "Transforming a traditional IT consulting firm to embrace strategic design thinking while maintaining operational excellence and client satisfaction.",
    },
    {
      id: "approach",
      title: "Strategic Approach",
      content:
        "Implemented a three-pillar strategy: design framework development, team capability enhancement, and thought leadership establishment.",
    },
    {
      id: "process",
      title: "Design Leadership Process",
      content:
        "Coached 15+ designers through strategic thinking development while executing measurable brand recognition and lead generation initiatives.",
    },
    {
      id: "impact",
      title: "Business Impact",
      content:
        "Achieved 50% brand recognition increase, 100+ qualified leads, and 40% improvement in team retention through strategic design leadership.",
    },
  ],
};

// Mock CaseStudyLayout component following Echo pattern
const MockNagarroCaseStudyLayout = ({
  data,
}: {
  data: typeof mockNagarroDataForCaseStudy;
}) => {
  return (
    <main role="main" className="w-full case-study-layout">
      <div data-testid="case-study-container">
        {/* Hero Section */}
        <section data-testid="case-study-hero" className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{data.hero.title}</h1>
            <p className="hero-subtitle">{data.hero.subtitle}</p>

            <div className="hero-metadata" data-testid="hero-metadata">
              <div className="metadata-item">
                <span className="label">Client:</span>
                <span className="value" data-testid="client-value">
                  {data.hero.client}
                </span>
              </div>
              <div className="metadata-item">
                <span className="label">Timeline:</span>
                <span className="value" data-testid="timeline-value">
                  {data.hero.timeline}
                </span>
              </div>
              <div
                className="metadata-item platforms"
                data-testid="platforms-container"
              >
                <span className="label">Platforms:</span>
                <div
                  className="platform-badges"
                  role="list"
                  aria-label="Project platforms"
                >
                  {data.hero.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="badge platform-badge"
                      role="listitem"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Media */}
            <div className="hero-media" data-testid="hero-media">
              <video
                src={data.hero.heroVideo}
                poster={data.hero.heroImage}
                controls
                className="hero-video"
                data-testid="hero-video"
                aria-label="Nagarro design leadership showcase video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section
          data-testid="metrics-section"
          className="metrics-section"
          aria-label="Project metrics"
        >
          <h2 className="section-title">Impact & Results</h2>
          <div className="metrics-grid" data-testid="metrics-grid">
            {data.metrics.map((metric, index) => (
              <article
                key={index}
                className="metric-card"
                data-testid={`metric-card-${index}`}
                role="article"
                aria-labelledby={`metric-label-${index}`}
              >
                <h3 id={`metric-label-${index}`} className="metric-label">
                  {metric.label}
                </h3>
                <div
                  className="metric-value"
                  data-testid={`metric-value-${index}`}
                >
                  {metric.value}
                </div>
                <p className="metric-description">{metric.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Content Sections */}
        <div className="content-sections" data-testid="content-sections">
          {data.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="case-study-section"
              data-testid={`section-${section.id}`}
              aria-labelledby={`section-title-${section.id}`}
            >
              <h2 id={`section-title-${section.id}`} className="section-title">
                {section.title}
              </h2>
              <div className="section-content">
                <p>{section.content}</p>
              </div>
            </section>
          ))}
        </div>

        {/* External Links Section */}
        <section
          data-testid="external-links-section"
          className="external-links-section"
        >
          <h2 className="section-title">Additional Resources</h2>
          <div
            className="external-links"
            role="list"
            aria-label="External resources"
          >
            <a
              href="https://www.scribd.com/document/nagarro-design-leadership-case-study"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link scribd-link"
              data-testid="scribd-document-link"
              role="listitem"
              aria-label="View comprehensive case study documentation on Scribd"
            >
              <span className="link-icon">📄</span>
              <span className="link-text">Complete Case Study (Scribd)</span>
              <span className="link-description">
                Detailed documentation with process insights
              </span>
            </a>

            <a
              href="https://medium.com/@randyellis/nagarro-design-leadership-transformation"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link medium-link"
              data-testid="medium-article-link"
              role="listitem"
              aria-label="Read design leadership insights and lessons learned on Medium"
            >
              <span className="link-icon">✍️</span>
              <span className="link-text">
                Design Leadership Article (Medium)
              </span>
              <span className="link-description">
                Strategic insights and lessons learned
              </span>
            </a>
          </div>
        </section>

        {/* Navigation/Scroll to Top */}
        <div
          className="case-study-navigation"
          data-testid="case-study-navigation"
        >
          <button
            className="scroll-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="scroll-to-top-btn"
            aria-label="Scroll to top of page"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </main>
  );
};

describe("Nagarro Case Study Layout - TDD Component Tests", () => {
  describe("Core Layout Structure", () => {
    it("renders main case study layout with proper semantic structure", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("main")).toHaveClass(
        "w-full case-study-layout",
      );
      expect(screen.getByTestId("case-study-container")).toBeInTheDocument();
    });

    it("renders all main sections with proper hierarchy", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      expect(screen.getByTestId("case-study-hero")).toBeInTheDocument();
      expect(screen.getByTestId("metrics-section")).toBeInTheDocument();
      expect(screen.getByTestId("content-sections")).toBeInTheDocument();
      expect(screen.getByTestId("external-links-section")).toBeInTheDocument();
      expect(screen.getByTestId("case-study-navigation")).toBeInTheDocument();
    });

    it("has proper heading hierarchy throughout the page", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      // H1 should be the main title
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(mockNagarroDataForCaseStudy.hero.title);

      // H2s should be section titles
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);

      // H3s should be metric labels
      const h3s = screen.getAllByRole("heading", { level: 3 });
      expect(h3s.length).toBe(mockNagarroDataForCaseStudy.metrics.length);
    });
  });

  describe("Hero Section Functionality", () => {
    it("displays hero content with correct metadata", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const heroSection = screen.getByTestId("case-study-hero");
      expect(heroSection).toHaveClass("hero-section");

      expect(
        screen.getByText(mockNagarroDataForCaseStudy.hero.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockNagarroDataForCaseStudy.hero.subtitle),
      ).toBeInTheDocument();
    });

    it("renders client and timeline information correctly", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      expect(screen.getByTestId("client-value")).toHaveTextContent(
        "Nagarro Software Engineering GmbH",
      );
      expect(screen.getByTestId("timeline-value")).toHaveTextContent(
        "Mar 2022 - Oct 2022 (8 months)",
      );
    });

    it("displays platform badges with proper accessibility", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const platformsContainer = screen.getByTestId("platforms-container");
      expect(platformsContainer).toBeInTheDocument();

      const platformsList = screen.getByRole("list", {
        name: "Project platforms",
      });
      expect(platformsList).toBeInTheDocument();

      const platformBadges = screen.getAllByRole("listitem");
      expect(platformBadges.length).toBeGreaterThanOrEqual(
        mockNagarroDataForCaseStudy.hero.platforms.length,
      );

      // Check that all platforms are displayed
      mockNagarroDataForCaseStudy.hero.platforms.forEach((platform) => {
        expect(screen.getByText(platform)).toBeInTheDocument();
      });
    });

    it("renders hero video with proper accessibility attributes", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const heroVideo = screen.getByTestId("hero-video");
      expect(heroVideo).toBeInTheDocument();
      expect(heroVideo).toHaveAttribute(
        "src",
        mockNagarroDataForCaseStudy.hero.heroVideo,
      );
      expect(heroVideo).toHaveAttribute(
        "poster",
        mockNagarroDataForCaseStudy.hero.heroImage,
      );
      expect(heroVideo).toHaveAttribute("controls");
      expect(heroVideo).toHaveAttribute(
        "aria-label",
        "Nagarro design leadership showcase video",
      );
    });
  });

  describe("Metrics Section Functionality", () => {
    it("renders all metrics with proper structure", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const metricsSection = screen.getByTestId("metrics-section");
      expect(metricsSection).toHaveClass("metrics-section");
      expect(metricsSection).toHaveAttribute("aria-label", "Project metrics");

      const metricsGrid = screen.getByTestId("metrics-grid");
      expect(metricsGrid).toBeInTheDocument();

      // Should have all metric cards
      mockNagarroDataForCaseStudy.metrics.forEach((_, index) => {
        expect(screen.getByTestId(`metric-card-${index}`)).toBeInTheDocument();
      });
    });

    it("displays metric values and descriptions correctly", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      mockNagarroDataForCaseStudy.metrics.forEach((metric, index) => {
        expect(screen.getByText(metric.label)).toBeInTheDocument();
        expect(screen.getByTestId(`metric-value-${index}`)).toHaveTextContent(
          metric.value,
        );
        expect(screen.getByText(metric.description)).toBeInTheDocument();
      });
    });

    it("has proper accessibility attributes for metric cards", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      mockNagarroDataForCaseStudy.metrics.forEach((metric, index) => {
        const metricCard = screen.getByTestId(`metric-card-${index}`);
        expect(metricCard).toHaveAttribute("role", "article");
        expect(metricCard).toHaveAttribute(
          "aria-labelledby",
          `metric-label-${index}`,
        );

        const metricLabel = screen.getByText(metric.label);
        expect(metricLabel).toHaveAttribute("id", `metric-label-${index}`);
      });
    });
  });

  describe("Content Sections Functionality", () => {
    it("renders all case study sections with proper IDs", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      mockNagarroDataForCaseStudy.sections.forEach((section) => {
        const sectionElement = screen.getByTestId(`section-${section.id}`);
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement).toHaveAttribute("id", section.id);
        expect(sectionElement).toHaveAttribute(
          "aria-labelledby",
          `section-title-${section.id}`,
        );
      });
    });

    it("displays section titles and content correctly", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      mockNagarroDataForCaseStudy.sections.forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
        expect(screen.getByText(section.content)).toBeInTheDocument();
      });
    });

    it("has proper semantic structure for sections", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const contentSections = screen.getByTestId("content-sections");
      expect(contentSections).toBeInTheDocument();

      // Each section should be a proper HTML section element
      mockNagarroDataForCaseStudy.sections.forEach((section) => {
        const sectionElement = screen.getByTestId(`section-${section.id}`);
        expect(sectionElement.tagName).toBe("SECTION");
      });
    });
  });

  describe("External Links Integration", () => {
    it("renders external links section with proper structure", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const externalLinksSection = screen.getByTestId("external-links-section");
      expect(externalLinksSection).toBeInTheDocument();

      const externalLinksList = screen.getByRole("list", {
        name: "External resources",
      });
      expect(externalLinksList).toBeInTheDocument();
    });

    it("displays Scribd link with correct attributes and content", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const scribdLink = screen.getByTestId("scribd-document-link");
      expect(scribdLink).toBeInTheDocument();
      expect(scribdLink).toHaveAttribute(
        "href",
        "https://www.scribd.com/document/nagarro-design-leadership-case-study",
      );
      expect(scribdLink).toHaveAttribute("target", "_blank");
      expect(scribdLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(scribdLink).toHaveAttribute(
        "aria-label",
        "View comprehensive case study documentation on Scribd",
      );

      expect(
        screen.getByText("Complete Case Study (Scribd)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Detailed documentation with process insights"),
      ).toBeInTheDocument();
    });

    it("displays Medium link with correct attributes and content", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const mediumLink = screen.getByTestId("medium-article-link");
      expect(mediumLink).toBeInTheDocument();
      expect(mediumLink).toHaveAttribute(
        "href",
        "https://medium.com/@randyellis/nagarro-design-leadership-transformation",
      );
      expect(mediumLink).toHaveAttribute("target", "_blank");
      expect(mediumLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(mediumLink).toHaveAttribute(
        "aria-label",
        "Read design leadership insights and lessons learned on Medium",
      );

      expect(
        screen.getByText("Design Leadership Article (Medium)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Strategic insights and lessons learned"),
      ).toBeInTheDocument();
    });

    it("has proper list structure for external links", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const externalLinks = [
        screen.getByTestId("scribd-document-link"),
        screen.getByTestId("medium-article-link"),
      ];

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("role", "listitem");
      });
    });
  });

  describe("Navigation and Interaction", () => {
    it("renders scroll to top button with proper functionality", async () => {
      const user = userEvent.setup();

      // Mock window.scrollTo
      const mockScrollTo = jest.fn();
      Object.defineProperty(window, "scrollTo", {
        writable: true,
        value: mockScrollTo,
      });

      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const scrollToTopBtn = screen.getByTestId("scroll-to-top-btn");
      expect(scrollToTopBtn).toBeInTheDocument();
      expect(scrollToTopBtn).toHaveAttribute(
        "aria-label",
        "Scroll to top of page",
      );

      await user.click(scrollToTopBtn);

      expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("handles video controls interaction", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const heroVideo = screen.getByTestId("hero-video");
      expect(heroVideo).toHaveAttribute("controls");

      // Video should be accessible for keyboard navigation
      expect(heroVideo).toBeInTheDocument();
    });
  });

  describe("Responsive Design Considerations", () => {
    it("has responsive classes for layout components", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("w-full");

      // Container should exist for responsive behavior
      expect(screen.getByTestId("case-study-container")).toBeInTheDocument();
    });

    it("structures metrics grid for responsive behavior", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const metricsGrid = screen.getByTestId("metrics-grid");
      expect(metricsGrid).toHaveClass("metrics-grid");
    });
  });

  describe("Performance and Loading Considerations", () => {
    it("optimizes video loading with poster image", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      const heroVideo = screen.getByTestId("hero-video");
      expect(heroVideo).toHaveAttribute(
        "poster",
        mockNagarroDataForCaseStudy.hero.heroImage,
      );
    });

    it("uses proper image paths for optimization", () => {
      const { hero } = mockNagarroDataForCaseStudy;
      expect(hero.heroImage.startsWith("/projects/nagarro/")).toBe(true);
      expect(hero.heroVideo.startsWith("/projects/nagarro/")).toBe(true);
    });
  });

  describe("Case Study Content Validation", () => {
    it("validates design leadership focus in content", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      // Title should emphasize design leadership
      const designLeadershipElements = screen.getAllByText(/Design Leadership/);
      expect(designLeadershipElements.length).toBeGreaterThan(0);

      // Should mention key leadership outcomes
      expect(screen.getAllByText(/50%/).length).toBeGreaterThan(0); // Brand recognition
      expect(screen.getAllByText(/100\+/).length).toBeGreaterThan(0); // Qualified leads
      expect(screen.getAllByText(/15\+/).length).toBeGreaterThan(0); // Designer coaching
    });

    it("ensures business impact metrics are prominent", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      // Key business metrics should be visible
      expect(
        screen.getByText("Brand Recognition Increase"),
      ).toBeInTheDocument();
      expect(screen.getByText("Qualified Leads Generated")).toBeInTheDocument();
      expect(
        screen.getByText("Team Retention Improvement"),
      ).toBeInTheDocument();
    });
  });

  describe("Integration with Case Study Patterns", () => {
    it("follows the same structure as Echo case study", () => {
      render(<MockNagarroCaseStudyLayout data={mockNagarroDataForCaseStudy} />);

      // Should have similar sections to Echo
      expect(screen.getByTestId("case-study-hero")).toBeInTheDocument();
      expect(screen.getByTestId("metrics-section")).toBeInTheDocument();
      expect(screen.getByTestId("content-sections")).toBeInTheDocument();

      // Should have consistent data structure
      expect(mockNagarroDataForCaseStudy).toHaveProperty("hero");
      expect(mockNagarroDataForCaseStudy).toHaveProperty("metrics");
      expect(mockNagarroDataForCaseStudy.hero).toHaveProperty("title");
      expect(mockNagarroDataForCaseStudy.hero).toHaveProperty("subtitle");
      expect(mockNagarroDataForCaseStudy.hero).toHaveProperty("heroImage");
      expect(mockNagarroDataForCaseStudy.hero).toHaveProperty("heroVideo");
    });

    it("maintains consistent metric structure with other projects", () => {
      mockNagarroDataForCaseStudy.metrics.forEach((metric) => {
        expect(metric).toHaveProperty("label");
        expect(metric).toHaveProperty("value");
        expect(metric).toHaveProperty("description");
      });
    });
  });
});
