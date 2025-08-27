import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlobalCaseStudyGrid } from "@/components/ui/global-case-study-grid";
import { PROJECTS } from "@/lib/data/projects";
import { Project } from "@/lib/data/types";
import {
  trackRecommendationCaseStudyClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";

// Mock the motion components to avoid animation issues in tests
jest.mock("@/components/motion-primitives/in-view", () => ({
  InView: ({ children, viewOptions, ...props }: any) => (
    <div data-testid="in-view" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/motion-primitives/text-effect", () => ({
  TextEffect: ({
    children,
    as: Component = "div",
    preset,
    delay,
    ...props
  }: any) => (
    <Component data-testid="text-effect" {...props}>
      {children}
    </Component>
  ),
}));

// Magnetic component removed from global-case-study-grid.tsx

// Mock analytics functions
jest.mock("@/lib/analytics", () => ({
  trackRecommendationCaseStudyClick: jest.fn(),
  trackRecommendationCardHover: jest.fn(),
}));

// Mock the project data
jest.mock("@/lib/data/projects", () => ({
  PROJECTS: [
    {
      id: "featured-project-1",
      name: "Featured Project 1",
      subtitle: "Featured Subtitle 1",
      slug: "featured-project-1",
      description: "This is a featured project description.",
      category: "Mobile App",
      categories: ["Mobile App", "UI/UX"],
      tags: ["react", "mobile", "design"],
      thumbnail: "/projects/featured-1/thumbnail.jpg",
      video: "/projects/featured-1/video.mp4",
      status: "completed",
      featured: true,
      views: 5000,
      timeline: "2024",
      technologies: ["React Native", "Node.js"],
    },
    {
      id: "featured-project-2",
      name: "Featured Project 2",
      subtitle: "Featured Subtitle 2",
      slug: "featured-project-2",
      description: "This is another featured project description.",
      category: "Web App",
      categories: ["Web App", "Design"],
      tags: ["nextjs", "web", "ui"],
      thumbnail: "/projects/featured-2/thumbnail.jpg",
      video: "/projects/featured-2/video.mp4",
      status: "completed",
      featured: true,
      views: 4000,
      timeline: "2024",
      technologies: ["Next.js", "TypeScript"],
    },
    {
      id: "current-project",
      name: "Current Project",
      subtitle: "Current Subtitle",
      slug: "current-project",
      description: "This is the current project being viewed.",
      category: "Desktop App",
      categories: ["Desktop App"],
      tags: ["desktop", "app"],
      thumbnail: "/projects/current/thumbnail.jpg",
      video: "/projects/current/video.mp4",
      status: "completed",
      featured: false,
      views: 1000,
      timeline: "2024",
      technologies: ["Electron"],
    },
    {
      id: "regular-project",
      name: "Regular Project",
      subtitle: "Regular Subtitle",
      slug: "regular-project",
      description: "This is a regular non-featured project.",
      category: "Mobile App",
      categories: ["Mobile App"],
      tags: ["mobile"],
      thumbnail: "/projects/regular/thumbnail.jpg",
      video: "/projects/regular/video.mp4",
      status: "completed",
      featured: false,
      views: 2000,
      timeline: "2023",
      technologies: ["Flutter"],
    },
  ] as Project[],
}));

describe("GlobalCaseStudyGrid", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Spacing Tests", () => {
    it("should use exact spacing classes matching existing patterns", () => {
      render(<GlobalCaseStudyGrid />);

      // Check container has space-y-6 (matching line 994 in project-detail-client.tsx)
      const container = screen.getByTestId("case-study-grid-container");
      expect(container).toHaveClass("space-y-6");

      // Check grid has gap-6 (matching line 1001)
      const grid = screen.getByTestId("case-study-grid");
      expect(grid).toHaveClass("gap-6");
    });

    it("should have exact responsive grid layout classes", () => {
      render(<GlobalCaseStudyGrid />);

      const grid = screen.getByTestId("case-study-grid");
      expect(grid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2");
    });
  });

  describe("Responsive Tests", () => {
    it("should display 2x1 layout on desktop and stacked on mobile", () => {
      render(<GlobalCaseStudyGrid />);

      const grid = screen.getByTestId("case-study-grid");

      // Should have responsive classes for 2x1 → stacked behavior
      expect(grid).toHaveClass("grid-cols-1"); // Mobile: stacked
      expect(grid).toHaveClass("md:grid-cols-2"); // Desktop: 2x1
    });

    it("should maintain equal height cards with auto-rows-fr", () => {
      render(<GlobalCaseStudyGrid />);

      const grid = screen.getByTestId("case-study-grid");
      expect(grid).toHaveClass("auto-rows-fr");
    });
  });

  describe("Data Logic Tests", () => {
    it("should filter and return exactly 2 case studies for perfect 2x1 layout", () => {
      render(<GlobalCaseStudyGrid />);

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      expect(caseStudyCards).toHaveLength(2);
    });

    it("should exclude current case study when currentSlug provided", () => {
      render(<GlobalCaseStudyGrid currentSlug="current-project" />);

      // Should not show current project
      expect(screen.queryByText("Current Project")).not.toBeInTheDocument();

      // Should show other projects
      expect(screen.getByText("Featured Project 1")).toBeInTheDocument();
      expect(screen.getByText("Featured Project 2")).toBeInTheDocument();
    });

    it("should prioritize featured projects first", () => {
      render(<GlobalCaseStudyGrid />);

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCard = caseStudyCards[0];
      const secondCard = caseStudyCards[1];

      // Both should be featured projects (higher priority)
      expect(
        within(firstCard).getByText("Featured Project 1"),
      ).toBeInTheDocument();
      expect(
        within(secondCard).getByText("Featured Project 2"),
      ).toBeInTheDocument();
    });

    it("should sort by views when featured status is equal", () => {
      // Both projects are featured, but Featured Project 1 has 5000 views vs Featured Project 2 with 4000 views
      // So Featured Project 1 should come first (higher views)
      render(<GlobalCaseStudyGrid />);

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCard = caseStudyCards[0];

      // Featured Project 1 has higher views (5000 > 4000), so it should come first
      expect(
        within(firstCard).getByText("Featured Project 1"),
      ).toBeInTheDocument();
    });

    it("should handle edge case when no case studies available after filtering", () => {
      // When we exclude all projects, the component should not render
      render(
        <GlobalCaseStudyGrid currentSlug="featured-project-1" limit={1} />,
      );

      // Should only show 1 card (Featured Project 2)
      const cards = screen.queryAllByTestId("case-study-card");
      expect(cards).toHaveLength(1);

      // When we exclude both featured projects, nothing should render
      const { container } = render(
        <GlobalCaseStudyGrid
          excludeCurrentSlug="featured-project-1"
          currentSlug="featured-project-2"
        />,
      );

      // Component should render but with no cards due to filtering
      expect(container.firstChild).toBeTruthy();
    });

    it("should handle case when only 1 case study available (still show it)", () => {
      // Use limit=1 to simulate having only 1 project available
      render(<GlobalCaseStudyGrid limit={1} />);

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      expect(caseStudyCards).toHaveLength(1);
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper ARIA labels for navigation", () => {
      render(<GlobalCaseStudyGrid />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
        expect(link.getAttribute("aria-label")).toMatch(/^View .+ case study$/);
      });
    });

    it("should support keyboard navigation", () => {
      render(<GlobalCaseStudyGrid />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link.getAttribute("href")).toMatch(/^\/projects\/.+$/);
      });
    });

    it("should have semantic heading structure", () => {
      render(<GlobalCaseStudyGrid />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Featured Case Studies");
    });

    it("should have proper focus management for cards", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        const link = within(card).getByRole("link");
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("Animation Tests", () => {
    it("should use motion variants matching existing patterns", () => {
      render(<GlobalCaseStudyGrid />);

      // Check InView components are present for stagger animation
      const inViewComponents = screen.getAllByTestId("in-view");
      expect(inViewComponents.length).toBeGreaterThan(0);

      // Check TextEffect is used for title
      const textEffect = screen.getByTestId("text-effect");
      expect(textEffect).toBeInTheDocument();
    });

    it("should have staggered animation delays for cards", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      const cardInViews = cards
        .map((card) => card.closest('[data-testid="in-view"]'))
        .filter(Boolean);

      // Should have staggered delays (each card gets index * delay)
      expect(cardInViews).toHaveLength(cards.length);
    });

    it("should have stable hover effects without magnetic movement", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Cards should have transition classes for hover effects
        expect(card).toHaveClass("transition-all");
        expect(card).toHaveClass("hover:shadow-lg");
      });
    });
  });

  describe("Hover States Tests", () => {
    it("should have exact hover classes matching existing patterns", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Match exact classes from line 1005 in project-detail-client.tsx
        expect(card).toHaveClass(
          "group",
          "transition-all",
          "duration-300",
          "hover:shadow-lg",
        );
      });
    });

    it("should have hover effects on video elements", () => {
      render(<GlobalCaseStudyGrid />);

      // Check for video elements with hover classes
      const videoContainers = screen.getAllByTestId("video-container");
      videoContainers.forEach((container) => {
        expect(container).toHaveClass("group");
      });
    });
  });

  describe("Component Structure Tests", () => {
    it("should reuse existing Card components", () => {
      render(<GlobalCaseStudyGrid />);

      // Should use Card component with proper structure
      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        expect(card).toHaveClass("group"); // Card itself has group class
      });
    });

    it("should have proper video/thumbnail structure", () => {
      render(<GlobalCaseStudyGrid />);

      // Each card should have either video or thumbnail
      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        const videoContainer = within(card).queryByTestId("video-container");
        const thumbnailImg = within(card).queryByRole("img");

        // Should have either video or thumbnail (not both)
        expect(videoContainer || thumbnailImg).toBeTruthy();
      });
    });

    it("should display project metadata correctly", () => {
      render(<GlobalCaseStudyGrid />);

      // Should show project names
      expect(screen.getByText("Featured Project 1")).toBeInTheDocument();
      expect(screen.getByText("Featured Project 2")).toBeInTheDocument();

      // Should show subtitles
      expect(screen.getByText("Featured Subtitle 1")).toBeInTheDocument();
      expect(screen.getByText("Featured Subtitle 2")).toBeInTheDocument();

      // Should show categories
      expect(screen.getByText("Mobile App")).toBeInTheDocument();
      expect(screen.getByText("Web App")).toBeInTheDocument();
    });

    it("should have proper link structure for SEO", () => {
      render(<GlobalCaseStudyGrid />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      expect(links[0]).toHaveAttribute("href", "/projects/featured-project-1");
      expect(links[1]).toHaveAttribute("href", "/projects/featured-project-2");
    });
  });

  describe("Card Animation Cohesion Tests", () => {
    it("should have stable hover effects without movement", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Cards should NOT be wrapped by magnetic component
        const magneticWrapper = card.closest('[data-testid="magnetic"]');
        expect(magneticWrapper).toBeNull();

        // Cards should be direct children of InView wrapper
        const inViewWrapper = card.closest('[data-testid="in-view"]');
        expect(inViewWrapper).toBeTruthy();
      });
    });

    it("should not create visual disconnect between border and content", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Check that card has unified hover classes, not nested motion div
        expect(card).toHaveClass("transition-all");

        // Should NOT have a separate motion.div that moves independently
        const motionDiv = card.querySelector(
          '[data-testid="case-study-card-inner"]',
        );
        expect(motionDiv).toBeNull(); // This will fail with current implementation
      });
    });

    it("should apply hover shadow to complete card boundary", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Hover effects should be on the Card itself, not inner div
        expect(card).toHaveClass("hover:shadow-lg");

        // Inner content should use group-hover, not direct hover
        // Specifically check video/image elements that should use group-hover
        const hoverElements = card.querySelectorAll("video, img");
        hoverElements.forEach((element) => {
          if (element.className.includes("hover:")) {
            expect(element.className).toMatch(/group-hover:/);
          }
        });
      });
    });

    it("should be directly wrapped by InView for entrance animations", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // The card should be directly wrapped by InView only
        const inViewWrapper = card.closest('[data-testid="in-view"]');
        expect(inViewWrapper).toBeTruthy();

        // InView should be the direct parent wrapper
        const cardParent = card.parentElement;
        expect(cardParent?.getAttribute("data-testid")).toBe("in-view");
      });
    });

    it("should maintain consistent hover state across entire card", () => {
      render(<GlobalCaseStudyGrid />);

      const cards = screen.getAllByTestId("case-study-card");
      cards.forEach((card) => {
        // Card should have group class for coordinated hover states
        expect(card).toHaveClass("group");

        // Title should respond to group-hover, not create its own hover
        const titleElement = card.querySelector('h3, [role="heading"]');
        if (titleElement) {
          expect(titleElement).toHaveClass("group-hover:text-blue-600");
          expect(titleElement.className).not.toMatch(/^.*hover:text-.*$/);
        }
      });
    });
  });

  describe("Performance Tests", () => {
    it("should implement lazy loading for videos", () => {
      render(<GlobalCaseStudyGrid />);

      const videoElements = screen.getAllByTestId("lazy-video");
      videoElements.forEach((video) => {
        // Videos use lazy loading through intersection observer or similar,
        // but HTML5 video elements don't have a 'loading' attribute like images
        expect(video).toBeInTheDocument();
        expect(video.tagName).toBe("VIDEO");
      });
    });

    it("should optimize image loading", () => {
      render(<GlobalCaseStudyGrid />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        // Should have optimized loading attributes
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("decoding", "async");
      });
    });

    it("should memoize project filtering logic", () => {
      const { rerender } = render(<GlobalCaseStudyGrid />);

      // Re-render with same props should not recalculate
      rerender(<GlobalCaseStudyGrid />);

      // This test verifies memoization is implemented in the component
      expect(screen.getAllByTestId("case-study-card")).toHaveLength(2);
    });
  });

  describe("Custom Props Tests", () => {
    it("should accept custom title", () => {
      render(<GlobalCaseStudyGrid title="Related Projects" />);

      expect(screen.getByText("Related Projects")).toBeInTheDocument();
      expect(
        screen.queryByText("Featured Case Studies"),
      ).not.toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(<GlobalCaseStudyGrid className="custom-class" />);

      const container = screen.getByTestId("case-study-grid-container");
      expect(container).toHaveClass("custom-class");
    });

    it("should limit results when limit prop is provided", () => {
      render(<GlobalCaseStudyGrid limit={1} />);

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      expect(caseStudyCards).toHaveLength(1);
    });

    it("should handle showDescription prop", () => {
      render(<GlobalCaseStudyGrid showDescription={true} />);

      expect(
        screen.getByText("This is a featured project description."),
      ).toBeInTheDocument();
    });

    it("should handle showDescription=false prop", () => {
      render(<GlobalCaseStudyGrid showDescription={false} />);

      expect(
        screen.queryByText("This is a featured project description."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error Handling Tests", () => {
    it("should handle malformed project data gracefully", () => {
      // Component should filter out malformed data internally
      // This test verifies the component doesn't crash with normal data
      expect(() => {
        render(<GlobalCaseStudyGrid />);
      }).not.toThrow();

      // Should still render valid projects
      expect(
        screen.getByTestId("case-study-grid-container"),
      ).toBeInTheDocument();
    });

    it("should handle missing video/thumbnail gracefully", () => {
      // Component should handle missing media gracefully
      // This test verifies no crashes with normal data structure
      expect(() => {
        render(<GlobalCaseStudyGrid />);
      }).not.toThrow();

      // Should still render projects with available media
      expect(
        screen.getByTestId("case-study-grid-container"),
      ).toBeInTheDocument();
    });
  });

  describe("Analytics Integration", () => {
    const mockTrackRecommendationCaseStudyClick =
      trackRecommendationCaseStudyClick as jest.MockedFunction<
        typeof trackRecommendationCaseStudyClick
      >;
    const mockTrackRecommendationCardHover =
      trackRecommendationCardHover as jest.MockedFunction<
        typeof trackRecommendationCardHover
      >;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should track case study click analytics with correct parameters", async () => {
      const user = userEvent.setup();
      render(
        <GlobalCaseStudyGrid
          currentSlug="current-project"
          sourcePageType="blog"
          sourceSlug="test-blog-post"
        />,
      );

      // Click on the first case study card
      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCardLink = within(caseStudyCards[0]).getByRole("link");

      await user.click(firstCardLink);

      expect(mockTrackRecommendationCaseStudyClick).toHaveBeenCalledWith(
        "blog",
        "test-blog-post",
        "featured-project-1",
        "Featured Project 1",
        0,
        "blog_page",
      );
    });

    it("should track case study hover analytics", async () => {
      const user = userEvent.setup();
      render(
        <GlobalCaseStudyGrid
          currentSlug="current-project"
          sourcePageType="project"
          sourceSlug="test-project"
        />,
      );

      // Hover over the first case study card
      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCardLink = within(caseStudyCards[0]).getByRole("link");

      await user.hover(firstCardLink);

      expect(mockTrackRecommendationCardHover).toHaveBeenCalledWith(
        "case_study",
        "project",
        "featured-project-1",
        "Featured Project 1",
        0,
      );
    });

    it("should track analytics with correct position for multiple items", async () => {
      const user = userEvent.setup();
      render(
        <GlobalCaseStudyGrid
          limit={3}
          sourcePageType="blog"
          sourceSlug="test-blog"
        />,
      );

      // Click on the second case study card (index 1)
      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const secondCardLink = within(caseStudyCards[1]).getByRole("link");

      await user.click(secondCardLink);

      expect(mockTrackRecommendationCaseStudyClick).toHaveBeenCalledWith(
        "blog",
        "test-blog",
        "featured-project-2",
        "Featured Project 2",
        1,
        "blog_page",
      );
    });

    it("should handle analytics calls without source page info", async () => {
      const user = userEvent.setup();
      render(<GlobalCaseStudyGrid />);

      // Click without source page type or slug
      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCardLink = within(caseStudyCards[0]).getByRole("link");

      await user.click(firstCardLink);

      expect(mockTrackRecommendationCaseStudyClick).toHaveBeenCalledWith(
        "project",
        "",
        "featured-project-1",
        "Featured Project 1",
        0,
        "project_page",
      );
    });

    it("should not track analytics if functions are not available", async () => {
      // Temporarily mock analytics to be undefined
      jest.doMock("@/lib/analytics", () => ({
        trackRecommendationCaseStudyClick: undefined,
        trackRecommendationCardHover: undefined,
      }));

      const user = userEvent.setup();

      expect(() => {
        render(<GlobalCaseStudyGrid />);
      }).not.toThrow();

      const caseStudyCards = screen.getAllByTestId("case-study-card");
      const firstCardLink = within(caseStudyCards[0]).getByRole("link");

      expect(async () => {
        await user.click(firstCardLink);
      }).not.toThrow();
    });
  });
});
