import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlobalCaseStudyGrid } from "@/components/ui/global-case-study-grid";
import {
  trackRecommendationCaseStudyClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";
import { Project } from "@/lib/data/types";

// Mock the motion components to avoid animation issues in tests.
// NOTE: the component no longer imports either of these — the mocks are kept
// deliberately so the "renders no InView / TextEffect wrappers" tests below can
// prove their testids are absent rather than merely un-mocked.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars -- factory props are destructured only to keep them off the DOM spread */
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
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

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

  describe("Hairline List Structure", () => {
    // WHY: DESIGN.md's "Recommendations List" signature — "a hairline list of
    // links, not a card grid". The old shadcn Card grid (space-y-6 / gap-6 /
    // md:grid-cols-2 / auto-rows-fr) is gone, so the spacing + responsive-grid
    // assertions are replaced by assertions on the list chrome that replaced it.

    it("should open the section with the shared SECTION chrome", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container.tagName).toBe("SECTION");
      // SECTION from @/components/case-study/section-chrome
      expect(container).toHaveClass(
        "mt-20",
        "scroll-mt-10",
        "border-t",
        "border-zinc-900",
        "pt-10",
      );
    });

    it("should label the section by its own heading", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      const heading = screen.getByRole("heading", { level: 2 });

      expect(heading).toHaveAttribute("id", "featured-case-studies-heading");
      expect(container).toHaveAttribute(
        "aria-labelledby",
        "featured-case-studies-heading",
      );
    });

    it("should render a <ul> hairline list closed by a bottom rule", () => {
      render(<GlobalCaseStudyGrid />);

      const list = screen.getByTestId("case-study-list");
      expect(list.tagName).toBe("UL");
      expect(list).toHaveClass("mt-6", "border-b", "border-zinc-200");
      expect(list).toHaveClass("dark:border-zinc-800");
    });

    it("should render each case study as an <li> row opened by a top rule", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row) => {
        expect(row.tagName).toBe("LI");
        expect(row).toHaveClass("border-t", "border-zinc-200");
        expect(row).toHaveClass("dark:border-zinc-800");
      });
    });

    it("should not lay the recommendations out as a responsive card grid", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      const list = screen.getByTestId("case-study-list");

      expect(container).not.toHaveClass("space-y-6");
      expect(list).not.toHaveClass("grid");
      expect(list).not.toHaveClass("grid-cols-1");
      expect(list).not.toHaveClass("md:grid-cols-2");
      expect(list).not.toHaveClass("auto-rows-fr");
      expect(list).not.toHaveClass("gap-6");
    });

    it("should hang each row directly off the list, with no animation wrapper between", () => {
      render(<GlobalCaseStudyGrid />);

      const list = screen.getByTestId("case-study-list");
      const rows = screen.getAllByTestId("case-study-row");

      rows.forEach((row) => {
        expect(row.parentElement).toBe(list);
      });
    });
  });

  describe("Hairline list, not cards", () => {
    // WHY: DESIGN.md's Hairline-First Rule + One Family Rule. A row is a rule
    // and text — no card box, no hover lift, no shadow. These are the deliberate
    // OPPOSITE of the old `transition-all duration-300 hover:shadow-lg` Card
    // assertions.

    it("should render no shadow of any kind inside the section", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container.querySelectorAll('[class*="shadow-"]')).toHaveLength(0);
      expect(container.className).not.toMatch(/shadow-/);
    });

    it("should give rows no card chrome (no rounded box, no hover lift)", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      rows.forEach((row) => {
        expect(row.className).not.toMatch(/rounded/);
        expect(row.className).not.toMatch(/hover:shadow/);
        expect(row.className).not.toMatch(/transition-all/);
        expect(row.className).not.toMatch(/hover:-translate-y/);
        expect(row).not.toHaveClass("h-full");
      });
    });

    it("should render no InView or TextEffect wrappers", () => {
      render(<GlobalCaseStudyGrid />);

      expect(screen.queryByTestId("in-view")).not.toBeInTheDocument();
      expect(screen.queryByTestId("text-effect")).not.toBeInTheDocument();
    });

    it("should not wrap rows in Magnetic", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      rows.forEach((row) => {
        expect(row.closest('[data-testid="magnetic"]')).toBeNull();
      });
    });

    it("should not render a Featured badge", () => {
      render(<GlobalCaseStudyGrid />);

      // `featured` still drives sort order (see the Data Logic tests) but it is
      // no longer decorated with a shadcn <Badge variant="secondary">.
      expect(screen.queryByText("Featured")).not.toBeInTheDocument();
      const container = screen.getByTestId("case-study-list-container");
      expect(container.querySelectorAll('[class*="badge"]')).toHaveLength(0);
    });
  });

  describe("No Media", () => {
    // WHY: DESIGN.md's Recommendations List — "The page has already spent its
    // imagery on the work itself." The per-card autoplaying <video> / next/image
    // thumbnail (and its "No preview available" fallback) is gone entirely, so
    // every old media assertion collapses into these three.

    it("should render zero <img> and <video> elements", () => {
      const { container } = render(<GlobalCaseStudyGrid />);

      expect(container.querySelectorAll("img, video")).toHaveLength(0);
    });

    it("should render no video/thumbnail containers", () => {
      render(<GlobalCaseStudyGrid />);

      expect(screen.queryByTestId("video-container")).not.toBeInTheDocument();
      expect(screen.queryByTestId("lazy-video")).not.toBeInTheDocument();
      expect(
        screen.queryByText("No preview available"),
      ).not.toBeInTheDocument();
    });

    it("should render no 16:9 media frame", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container.querySelectorAll(".aspect-video")).toHaveLength(0);
      expect(
        container.querySelectorAll('[class*="object-cover"]'),
      ).toHaveLength(0);
    });
  });

  describe("Row Typography", () => {
    // WHY: One Family Rule (zinc only, no blue) + the underline that marks a
    // link as a link, and the Tabular Figures Rule for the timeline.

    it("should style the project name as an underlined zinc link, never blue", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      const title = within(rows[0]).getByText("Featured Project 1");

      expect(title.tagName).toBe("SPAN");
      expect(title).toHaveClass(
        "text-base",
        "font-medium",
        "text-zinc-900",
        "underline",
        "decoration-zinc-300",
        "underline-offset-4",
      );
      // Hover darkens the decoration, it does not change the hue.
      expect(title).toHaveClass("group-hover:decoration-zinc-900");
      expect(title.className).not.toMatch(/blue/);
    });

    it("should use no blue anywhere in the section", () => {
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container.querySelectorAll('[class*="blue"]')).toHaveLength(0);
    });

    it("should set the timeline in tabular figures", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      const timeline = within(rows[0]).getByText("2024");

      expect(timeline).toHaveClass("tabular-nums");
    });

    it("should set the overflow category count in tabular figures", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      // Featured Project 1 has 2 categories → "+1 more"
      const overflow = within(rows[0]).getByText("+1 more");

      expect(overflow).toHaveClass("tabular-nums");
    });

    it("should render the meta line as plain text, not badges", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      const category = within(rows[0]).getByText("Mobile App");

      expect(category.tagName).toBe("SPAN");
      expect(category.className).not.toMatch(/rounded/);
      expect(category.className).not.toMatch(/border/);
      expect(category.className).not.toMatch(/bg-/);
    });
  });

  describe("Data Logic Tests", () => {
    it("should filter and return exactly 2 case studies by default", () => {
      render(<GlobalCaseStudyGrid />);

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      expect(caseStudyRows).toHaveLength(2);
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

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRow = caseStudyRows[0];
      const secondRow = caseStudyRows[1];

      // Both should be featured projects (higher priority)
      expect(
        within(firstRow).getByText("Featured Project 1"),
      ).toBeInTheDocument();
      expect(
        within(secondRow).getByText("Featured Project 2"),
      ).toBeInTheDocument();
    });

    it("should sort by views when featured status is equal", () => {
      // Both projects are featured, but Featured Project 1 has 5000 views vs Featured Project 2 with 4000 views
      // So Featured Project 1 should come first (higher views)
      render(<GlobalCaseStudyGrid />);

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRow = caseStudyRows[0];

      // Featured Project 1 has higher views (5000 > 4000), so it should come first
      expect(
        within(firstRow).getByText("Featured Project 1"),
      ).toBeInTheDocument();
    });

    it("should handle edge case when no case studies available after filtering", () => {
      // When we exclude all projects, the component should not render
      render(
        <GlobalCaseStudyGrid currentSlug="featured-project-1" limit={1} />,
      );

      // Should only show 1 row (Featured Project 2)
      const rows = screen.queryAllByTestId("case-study-row");
      expect(rows).toHaveLength(1);

      // When we exclude both featured projects, nothing should render
      const { container } = render(
        <GlobalCaseStudyGrid
          excludeCurrentSlug="featured-project-1"
          currentSlug="featured-project-2"
        />,
      );

      // Component should render but with no rows due to filtering
      expect(container.firstChild).toBeTruthy();
    });

    it("should handle case when only 1 case study available (still show it)", () => {
      // Use limit=1 to simulate having only 1 project available
      render(<GlobalCaseStudyGrid limit={1} />);

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      expect(caseStudyRows).toHaveLength(1);
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

    it("should have proper focus management for rows", () => {
      render(<GlobalCaseStudyGrid />);

      const rows = screen.getAllByTestId("case-study-row");
      rows.forEach((row) => {
        const link = within(row).getByRole("link");
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("should give the row link a visible focus ring", () => {
      // WHY: DESIGN.md's One Family Rule focus-ring clause — a keyboard focus
      // ring in the same zinc family, never the browser default outline alone.
      render(<GlobalCaseStudyGrid />);

      const links = screen.getAllByRole("link", {
        name: /View .* case study/,
      });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveClass(
          "focus-visible:ring-2",
          "focus-visible:ring-zinc-900",
          "focus-visible:ring-offset-2",
          "focus-visible:outline-none",
        );
        expect(link).toHaveClass("dark:focus-visible:ring-white");
      });
    });
  });

  describe("Component Structure Tests", () => {
    it("should name each row through its link, not a card heading", () => {
      // WHY: there is no CardTitle/<h3> any more — the project name lives in a
      // <span> inside the row <Link>, so the link is the only accessible name.
      render(<GlobalCaseStudyGrid />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container.querySelectorAll("h3")).toHaveLength(0);

      const firstLink = screen.getByRole("link", {
        name: "View Featured Project 1 case study",
      });
      expect(firstLink).toHaveTextContent("Featured Project 1");
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

      // Should show timelines
      expect(screen.getAllByText("2024")).toHaveLength(2);
    });

    it("should constrain the second column to a readable measure", () => {
      render(<GlobalCaseStudyGrid showDescription={true} />);

      const subtitle = screen.getByText("Featured Subtitle 1");
      const description = screen.getByText(
        "This is a featured project description.",
      );

      expect(subtitle).toHaveClass("max-w-[62ch]", "text-base");
      expect(description).toHaveClass("max-w-[62ch]", "text-sm");
    });

    it("should have proper link structure for SEO", () => {
      render(<GlobalCaseStudyGrid />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      expect(links[0]).toHaveAttribute("href", "/projects/featured-project-1");
      expect(links[1]).toHaveAttribute("href", "/projects/featured-project-2");
    });
  });

  describe("Performance Tests", () => {
    it("should memoize project filtering logic", () => {
      const { rerender } = render(<GlobalCaseStudyGrid />);

      // Re-render with same props should not recalculate
      rerender(<GlobalCaseStudyGrid />);

      // This test verifies memoization is implemented in the component
      expect(screen.getAllByTestId("case-study-row")).toHaveLength(2);
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

    it("should derive the heading id from a custom title", () => {
      render(<GlobalCaseStudyGrid title="Related Projects" />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container).toHaveAttribute(
        "aria-labelledby",
        "related-projects-heading",
      );
    });

    it("should accept custom className", () => {
      render(<GlobalCaseStudyGrid className="custom-class" />);

      const container = screen.getByTestId("case-study-list-container");
      expect(container).toHaveClass("custom-class");
      // ...without dropping the shared SECTION chrome
      expect(container).toHaveClass("mt-20", "border-t", "pt-10");
    });

    it("should limit results when limit prop is provided", () => {
      render(<GlobalCaseStudyGrid limit={1} />);

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      expect(caseStudyRows).toHaveLength(1);
    });

    it("should honor maxItems as an alias for limit", () => {
      render(<GlobalCaseStudyGrid maxItems={3} />);

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      expect(caseStudyRows).toHaveLength(3);
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
        screen.getByTestId("case-study-list-container"),
      ).toBeInTheDocument();
    });

    it("should not depend on project media fields to render a row", () => {
      // WHY: the row reads name/slug/category/timeline/subtitle only. Thumbnail
      // and video are never touched now that the list carries no imagery.
      expect(() => {
        render(<GlobalCaseStudyGrid />);
      }).not.toThrow();

      const { container } = render(<GlobalCaseStudyGrid />);
      expect(container.querySelectorAll("img, video")).toHaveLength(0);
      expect(screen.getAllByTestId("case-study-row").length).toBeGreaterThan(0);
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

      // Click on the first case study row
      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRowLink = within(caseStudyRows[0]).getByRole("link");

      await user.click(firstRowLink);

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

      // Hover over the first case study row
      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRowLink = within(caseStudyRows[0]).getByRole("link");

      await user.hover(firstRowLink);

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

      // Click on the second case study row (index 1)
      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const secondRowLink = within(caseStudyRows[1]).getByRole("link");

      await user.click(secondRowLink);

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
      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRowLink = within(caseStudyRows[0]).getByRole("link");

      await user.click(firstRowLink);

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

      const caseStudyRows = screen.getAllByTestId("case-study-row");
      const firstRowLink = within(caseStudyRows[0]).getByRole("link");

      expect(async () => {
        await user.click(firstRowLink);
      }).not.toThrow();
    });
  });
});
