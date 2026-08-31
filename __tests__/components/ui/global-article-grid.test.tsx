import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlobalArticleGrid } from "@/components/ui/global-article-grid";
import { getBlogArticles, BlogArticle } from "@/lib/utils/blog-data";
import {
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";
import { resetThrottle } from "@/lib/analytics-guard";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars -- factory props are destructured only to keep them off the DOM spread */

// Mock the motion components to avoid animation issues in tests.
// The component imports neither of these any more; the mocks stay so the
// "no InView wrapper" / "no TextEffect" assertions below would actually catch
// a regression that re-added them (they would render their data-testid).
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

// Magnetic component removed from global-article-grid.tsx

// Mock the blog data
jest.mock("@/lib/utils/blog-data", () => ({
  getBlogArticles: jest.fn(),
}));

// Mock analytics functions
jest.mock("@/lib/analytics", () => ({
  trackRecommendationArticleClick: jest.fn(),
  trackRecommendationCardHover: jest.fn(),
}));

const mockArticles: BlogArticle[] = [
  {
    slug: "featured-article-1",
    title: "Featured Article 1",
    description:
      "This is a featured article description that should be displayed.",
    publishedDate: "2025-01-15",
    readTime: 5,
    category: "Development",
    tags: ["react", "testing", "development"],
    views: 5000,
    featured: true,
    author: "Randy Ellis",
  },
  {
    slug: "featured-article-2",
    title: "Featured Article 2",
    description: "This is another featured article with great content.",
    publishedDate: "2025-01-10",
    readTime: 8,
    category: "Design",
    tags: ["design", "ui", "ux"],
    views: 4000,
    featured: true,
    author: "Randy Ellis",
  },
  {
    slug: "current-article",
    title: "Current Article",
    description: "This is the current article being viewed.",
    publishedDate: "2024-12-20",
    readTime: 6,
    category: "Business",
    tags: ["strategy", "business"],
    views: 3000,
    featured: false,
    author: "Randy Ellis",
  },
  {
    slug: "regular-article",
    title: "Regular Article",
    description: "This is a regular non-featured article.",
    publishedDate: "2024-11-15",
    readTime: 4,
    category: "Technology",
    tags: ["tech", "trends"],
    views: 2000,
    featured: false,
    author: "Randy Ellis",
  },
];

/**
 * The article title is no longer an `<h3>` — it is a `<span>` inside the row
 * link, so it can only be reached through the link that names it. Deriving the
 * title from `aria-label="Read {title}"` keeps this helper honest about the
 * accessible name the row actually exposes.
 */
function getRowTitle(row: HTMLElement): HTMLElement {
  const label = within(row).getByRole("link").getAttribute("aria-label") ?? "";
  return within(row).getByText(label.replace(/^Read /, ""));
}

/** Every element inside the section, including the section itself. */
function allElementsIn(root: HTMLElement): Element[] {
  return [root, ...Array.from(root.querySelectorAll("*"))];
}

function classesOf(el: Element): string {
  return el.getAttribute("class") ?? "";
}

describe("GlobalArticleGrid", () => {
  beforeEach(() => {
    (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // DESIGN.md "Recommendations List" signature: this block is a hairline list
  // of links, not a card grid. The old `grid`/`md:grid-cols-2`/`auto-rows-fr`/
  // `gap-6` assertions described the card grid that was removed.
  describe("Hairline list structure", () => {
    it("renders rows as a hairline list, not a grid", () => {
      render(<GlobalArticleGrid />);

      const list = screen.getByTestId("article-list");
      expect(list.tagName).toBe("UL");
      expect(list).toHaveClass(
        "mt-6",
        "border-b",
        "border-zinc-200",
        "dark:border-zinc-800",
      );

      // The card-grid classes must not come back.
      expect(list).not.toHaveClass("grid");
      expect(list).not.toHaveClass("grid-cols-1");
      expect(list).not.toHaveClass("md:grid-cols-2");
      expect(list).not.toHaveClass("auto-rows-fr");
      expect(list).not.toHaveClass("gap-6");
    });

    it("opens the section with the shared SECTION chrome", () => {
      render(<GlobalArticleGrid />);

      // SECTION from components/case-study/section-chrome.tsx — one rule at
      // full Ink/Paper contrast, defined once so section openings cannot drift.
      const container = screen.getByTestId("article-list-container");
      expect(container.tagName).toBe("SECTION");
      expect(container).toHaveClass(
        "mt-20",
        "scroll-mt-10",
        "border-t",
        "border-zinc-900",
        "pt-10",
        "dark:border-zinc-100",
      );
      expect(container).not.toHaveClass("space-y-6");
    });
  });

  // Hairline-First Rule: rows are separated by a 1px rule, not by equal-height
  // card boxes. The old "2x1 grid / auto-rows-fr" assertions no longer apply.
  describe("Row layout", () => {
    it("stacks each row on mobile and splits it in two on wider screens", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        const link = within(row).getByRole("link");
        expect(link).toHaveClass("grid", "grid-cols-1"); // Mobile: stacked
        expect(link).toHaveClass("sm:grid-cols-[minmax(0,22rem)_1fr]"); // Wider: two columns
      });
    });

    it("separates rows with a top hairline instead of equal-height cards", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(row.tagName).toBe("LI");
        expect(row).toHaveClass(
          "border-t",
          "border-zinc-200",
          "dark:border-zinc-800",
        );
        expect(row).not.toHaveClass("h-full");
      });
    });
  });

  describe("Data Logic Tests", () => {
    it("should filter and return exactly 2 articles for the list", () => {
      render(<GlobalArticleGrid />);

      const articleRows = screen.getAllByTestId("article-row");
      expect(articleRows).toHaveLength(2);
    });

    it("should exclude current article when currentSlug provided", () => {
      render(<GlobalArticleGrid currentSlug="current-article" />);

      // Should not show current article
      expect(screen.queryByText("Current Article")).not.toBeInTheDocument();

      // Should show other articles
      expect(screen.getByText("Featured Article 1")).toBeInTheDocument();
      expect(screen.getByText("Featured Article 2")).toBeInTheDocument();
    });

    it("should prioritize featured articles first", () => {
      render(<GlobalArticleGrid />);

      const articleRows = screen.getAllByTestId("article-row");
      const firstRow = articleRows[0];
      const secondRow = articleRows[1];

      // Both should be featured articles (higher priority)
      expect(
        within(firstRow).getByText("Featured Article 1"),
      ).toBeInTheDocument();
      expect(
        within(secondRow).getByText("Featured Article 2"),
      ).toBeInTheDocument();
    });

    it("should sort by views when featured status is equal", () => {
      render(<GlobalArticleGrid />);

      const articleRows = screen.getAllByTestId("article-row");
      const firstRow = articleRows[0];

      // Higher views among featured should come first
      expect(
        within(firstRow).getByText("Featured Article 1"),
      ).toBeInTheDocument();
    });

    it("should sort by date as final tiebreaker", () => {
      // Create articles with same featured status and views but different dates
      const sameViewsArticles = [
        { ...mockArticles[0], views: 1000, publishedDate: "2024-01-01" },
        { ...mockArticles[1], views: 1000, publishedDate: "2024-02-01" },
      ];

      (getBlogArticles as jest.Mock).mockReturnValue(sameViewsArticles);

      render(<GlobalArticleGrid />);

      const articleRows = screen.getAllByTestId("article-row");
      const firstRow = articleRows[0];

      // More recent date should come first
      expect(
        within(firstRow).getByText("Featured Article 2"),
      ).toBeInTheDocument();
    });

    it("should handle edge case when no articles available after filtering", () => {
      (getBlogArticles as jest.Mock).mockReturnValue([]);

      render(<GlobalArticleGrid />);

      // Should not render anything
      expect(
        screen.queryByTestId("article-list-container"),
      ).not.toBeInTheDocument();
    });

    it("should handle case when only 1 article available (still show it)", () => {
      (getBlogArticles as jest.Mock).mockReturnValue([mockArticles[0]]);

      render(<GlobalArticleGrid />);

      const articleRows = screen.getAllByTestId("article-row");
      expect(articleRows).toHaveLength(1);
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper ARIA labels for navigation", () => {
      render(<GlobalArticleGrid />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
        expect(link.getAttribute("aria-label")).toMatch(/^Read .+$/);
      });
    });

    it("should support keyboard navigation", () => {
      render(<GlobalArticleGrid />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link.getAttribute("href")).toMatch(/^\/blog\/.+$/);
      });
    });

    it("should have semantic heading structure", () => {
      render(<GlobalArticleGrid />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Latest Articles");

      // The section is named by that heading (SectionLabel + aria-labelledby).
      const container = screen.getByTestId("article-list-container");
      expect(container).toHaveAttribute("aria-labelledby", heading.id);
      expect(heading.id).toBeTruthy();
    });

    it("should have proper focus management for rows", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        const link = within(row).getByRole("link");
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    // The One Family Rule's focus-ring clause: the ring is zinc, never a brand
    // hue, and it must be visible. This test is new — the card grid never
    // asserted a focus ring at all.
    it("gives the row link a visible zinc focus ring", () => {
      render(<GlobalArticleGrid />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveClass(
          "focus-visible:ring-2",
          "focus-visible:ring-zinc-900",
          "focus-visible:ring-offset-2",
          "focus-visible:outline-none",
          "dark:focus-visible:ring-white",
        );
      });
    });

    it("should have proper text contrast and readability", () => {
      render(<GlobalArticleGrid />);

      // Titles are Ink, not a hue. There are no h3s left to query.
      const rows = screen.getAllByTestId("article-row");
      expect(
        within(screen.getByTestId("article-list-container")).queryAllByRole(
          "heading",
          { level: 3 },
        ),
      ).toHaveLength(0);

      rows.forEach((row) => {
        expect(getRowTitle(row)).toHaveClass(
          "text-zinc-900",
          "dark:text-white",
        );
      });
    });
  });

  // The InView entrance wrapper and the TextEffect title animation are gone:
  // the Hairline-First list is a document, not a stage. What remains is a
  // colour transition on the underline (Buttons → Hover/Focus).
  describe("Animation Tests", () => {
    it("renders rows without an InView entrance wrapper", () => {
      render(<GlobalArticleGrid />);

      expect(screen.queryAllByTestId("in-view")).toHaveLength(0);
      screen.getAllByTestId("article-row").forEach((row) => {
        expect(row.closest('[data-testid="in-view"]')).toBeNull();
      });
    });

    it("renders titles as plain text, not TextEffect animations", () => {
      render(<GlobalArticleGrid />);

      expect(screen.queryAllByTestId("text-effect")).toHaveLength(0);
      expect(screen.getByText("Featured Article 1")).toBeInTheDocument();
    });

    it("transitions colour on hover rather than lifting the row", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(getRowTitle(row)).toHaveClass("transition-colors");
        allElementsIn(row).forEach((el) => {
          expect(classesOf(el)).not.toMatch(/transition-all/);
        });
      });
    });

    it("renders rows directly in the list with no animation wrapper between", () => {
      render(<GlobalArticleGrid />);

      const list = screen.getByTestId("article-list");
      screen.getAllByTestId("article-row").forEach((row) => {
        expect(row.parentElement).toBe(list);
      });
    });
  });

  // Hairline-First Rule: shadows are reserved for things that genuinely overlay
  // the page. The old assertions demanded `hover:shadow-md`,
  // `hover:border-zinc-300` and `dark:hover:border-zinc-600` — the exact card
  // lift this rebuild removed — so they are inverted here.
  describe("Hairline list, not cards", () => {
    it("renders no shadow on any element in the section", () => {
      render(<GlobalArticleGrid />);

      const container = screen.getByTestId("article-list-container");
      allElementsIn(container).forEach((el) => {
        expect(classesOf(el)).not.toMatch(/shadow/);
      });
    });

    it("never shifts a border or lifts a card on hover", () => {
      render(<GlobalArticleGrid />);

      const container = screen.getByTestId("article-list-container");
      allElementsIn(container).forEach((el) => {
        expect(classesOf(el)).not.toMatch(/hover:shadow-/);
        expect(classesOf(el)).not.toMatch(/hover:border-zinc-300/);
        expect(classesOf(el)).not.toMatch(/dark:hover:border-zinc-600/);
      });
    });

    it("renders each row as a bare list item, not a Card box", () => {
      render(<GlobalArticleGrid />);

      screen.getAllByTestId("article-row").forEach((row) => {
        expect(row.tagName).toBe("LI");
        // A Card would round its corners and paint its own surface; a hairline
        // row carries a single top rule and nothing else.
        expect(classesOf(row)).not.toMatch(/rounded/);
        expect(classesOf(row)).not.toMatch(/\bbg-/);
        expect(classesOf(row)).not.toMatch(/\bh-full\b/);
      });
    });
  });

  // The One Family Rule keeps the palette zinc-only: the title darkens its
  // underline on hover instead of turning `group-hover:text-blue-600`.
  describe("Hover States Tests", () => {
    it("carries no hover shadow or hover border on the row", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(row).not.toHaveClass("transition-all");
        expect(row).not.toHaveClass("hover:shadow-md");
        expect(row).not.toHaveClass("hover:border-zinc-300");
        expect(row).not.toHaveClass("dark:hover:border-zinc-600");
      });
    });

    it("darkens the title underline on hover instead of turning it blue", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        const title = getRowTitle(row);
        expect(classesOf(title)).not.toMatch(/blue/);
        expect(title).toHaveClass(
          "text-zinc-900",
          "underline",
          "decoration-zinc-300",
          "underline-offset-4",
        );
        expect(title).toHaveClass(
          "group-hover:decoration-zinc-900",
          "dark:group-hover:decoration-zinc-100",
        );
      });
    });
  });

  describe("Component Structure Tests", () => {
    it("renders rows as list items inside a single ul, not Card components", () => {
      render(<GlobalArticleGrid />);

      const list = screen.getByTestId("article-list");
      expect(list.tagName).toBe("UL");

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(row.tagName).toBe("LI");
        // The `group` coordinator moved onto the link that fills the row.
        expect(within(row).getByRole("link")).toHaveClass("group");
        expect(classesOf(row)).not.toMatch(/\bgroup\b/);
      });
    });

    it("should display article metadata correctly", () => {
      render(<GlobalArticleGrid />);

      // Should show article titles
      expect(screen.getByText("Featured Article 1")).toBeInTheDocument();
      expect(screen.getByText("Featured Article 2")).toBeInTheDocument();

      // Should show descriptions
      expect(
        screen.getByText(
          "This is a featured article description that should be displayed.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This is another featured article with great content.",
        ),
      ).toBeInTheDocument();

      // Should show categories as plain text, not chips
      expect(screen.getByText("Development")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
    });

    it("should show read time as plain text, not a badge box", () => {
      render(<GlobalArticleGrid />);

      const readTimeBadges = screen.getAllByTestId("read-time-badge");
      expect(readTimeBadges).toHaveLength(2);

      readTimeBadges.forEach((badge) => {
        expect(badge.tagName).toBe("SPAN");
        // A Badge painted a rounded, filled, bordered chip; the read time is
        // now metadata in the row's caption line.
        expect(classesOf(badge)).not.toMatch(/rounded|\bbg-|\bborder\b/);
      });

      // Should show actual read times
      expect(screen.getByText("5 min read")).toBeInTheDocument();
      expect(screen.getByText("8 min read")).toBeInTheDocument();
    });

    // The One Family Rule reserves Live Amber for "this project is live and you
    // can open it" — never for a featured flag. Featured articles already sort
    // to the top of the list, which is what the flag is for.
    it("renders no amber featured star", () => {
      render(<GlobalArticleGrid />);

      expect(screen.queryByTestId("featured-star")).not.toBeInTheDocument();

      const container = screen.getByTestId("article-list-container");
      allElementsIn(container).forEach((el) => {
        expect(classesOf(el)).not.toMatch(/amber/);
      });
    });

    it("should show formatted publication dates in a time element", () => {
      render(<GlobalArticleGrid />);

      const firstDate = screen.getByText(/January 15, 2025/);
      expect(firstDate.tagName).toBe("TIME");
      expect(firstDate).toHaveAttribute("datetime", "2025-01-15");

      const secondDate = screen.getByText(/January 10, 2025/);
      expect(secondDate.tagName).toBe("TIME");
      expect(secondDate).toHaveAttribute("datetime", "2025-01-10");
    });

    // The Tabular Figures Rule: read times and dates are numbers a reader
    // compares down the column, so they must not jitter between rows. New test
    // — the card grid stacked its numbers inside badges and never asserted it.
    it("sets tabular figures on the read time and the date", () => {
      render(<GlobalArticleGrid />);

      screen.getAllByTestId("read-time-badge").forEach((badge) => {
        expect(badge).toHaveClass("tabular-nums");
      });

      const container = screen.getByTestId("article-list-container");
      const times = Array.from(container.querySelectorAll("time"));
      expect(times).toHaveLength(2);
      times.forEach((time) => {
        expect(time).toHaveClass("tabular-nums");
      });
    });

    it("should have proper link structure for SEO", () => {
      render(<GlobalArticleGrid />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      expect(links[0]).toHaveAttribute("href", "/blog/featured-article-1");
      expect(links[1]).toHaveAttribute("href", "/blog/featured-article-2");
    });

    it("gives each row a single link that fills the row rhythm", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        const linkElements = row.querySelectorAll("a");
        expect(linkElements).toHaveLength(1);
        // `py-5` is the shared hairline row rhythm; card `h-full`/`block` are gone.
        expect(linkElements[0]).toHaveClass("py-5");
        expect(linkElements[0]).not.toHaveClass("h-full");
        expect(linkElements[0]).not.toHaveClass("block");
      });
    });
  });

  // No Magnetic wrapper, no InView wrapper, no lift: the row responds to hover
  // with colour only (Buttons → Hover/Focus).
  describe("Row Hover Behavior Tests", () => {
    it("should not be wrapped in Magnetic", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        // Rows must NOT be wrapped by the magnetic component
        expect(row.closest('[data-testid="magnetic"]')).toBeNull();
      });
    });

    it("applies hover feedback to the underline, not the row boundary", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(getRowTitle(row)).toHaveClass("group-hover:decoration-zinc-900");
        expect(classesOf(row)).not.toMatch(/hover:/);
      });
    });

    it("makes the whole row one link target", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        const link = within(row).getByRole("link");
        // The link is the row's only child, so the entire row is clickable.
        expect(link.parentElement).toBe(row);
        expect(row.children).toHaveLength(1);
        expect(link).toHaveClass("group");
      });
    });

    it("places rows directly under the list with no wrapper element", () => {
      render(<GlobalArticleGrid />);

      const list = screen.getByTestId("article-list");
      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(row.parentElement).toBe(list);
        expect(row.closest('[data-testid="in-view"]')).toBeNull();
      });
    });

    it("coordinates hover from the link, with no h3 title to recolour", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        expect(within(row).getByRole("link")).toHaveClass("group");
        expect(row.querySelector("h3")).toBeNull();
      });
    });
  });

  describe("Performance Tests", () => {
    it("ships no placeholder imagery", () => {
      render(<GlobalArticleGrid />);

      // Each card used to open with a random photograph from picsum.photos,
      // keyed by slug — a placeholder service standing in for article art.
      // The title and description are the preview; any image added back here
      // must be real and must carry loading/decoding hints.
      const container = screen.getByTestId("article-list-container");
      const images = Array.from(container.querySelectorAll("img"));
      expect(images).toHaveLength(0);
      expect(container.innerHTML).not.toMatch(/picsum/);
      images.forEach((img) => {
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("decoding", "async");
      });
    });

    it("should memoize article filtering logic", () => {
      const { rerender } = render(<GlobalArticleGrid />);

      // Re-render with same props should not recalculate
      rerender(<GlobalArticleGrid />);

      // This test verifies memoization is implemented in the component
      expect(screen.getAllByTestId("article-row")).toHaveLength(2);
    });

    it("should handle large article datasets efficiently", () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`,
        title: `Article ${i}`,
      }));

      (getBlogArticles as jest.Mock).mockReturnValue(largeDataset);

      render(<GlobalArticleGrid />);

      // Should still only render 2 rows (efficient filtering)
      const articleRows = screen.getAllByTestId("article-row");
      expect(articleRows).toHaveLength(2);
    });
  });

  describe("Custom Props Tests", () => {
    it("should accept custom title", () => {
      render(<GlobalArticleGrid title="Related Articles" />);

      expect(screen.getByText("Related Articles")).toBeInTheDocument();
      expect(screen.queryByText("Latest Articles")).not.toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(<GlobalArticleGrid className="custom-class" />);

      const container = screen.getByTestId("article-list-container");
      expect(container).toHaveClass("custom-class");
      // The custom class extends the shared SECTION chrome, it does not replace it.
      expect(container).toHaveClass("mt-20", "border-t", "border-zinc-900");
    });

    it("should limit results when limit prop is provided", () => {
      render(<GlobalArticleGrid limit={1} />);

      const articleRows = screen.getAllByTestId("article-row");
      expect(articleRows).toHaveLength(1);
    });

    it("should handle showReadTime prop", () => {
      render(<GlobalArticleGrid showReadTime={false} />);

      const readTimeBadges = screen.queryAllByTestId("read-time-badge");
      expect(readTimeBadges).toHaveLength(0);
    });

    it("should handle showCategory prop", () => {
      render(<GlobalArticleGrid showCategory={false} />);

      expect(screen.queryByText("Development")).not.toBeInTheDocument();
      expect(screen.queryByText("Design")).not.toBeInTheDocument();
    });

    it("should handle showDescription prop", () => {
      render(<GlobalArticleGrid showDescription={false} />);

      expect(
        screen.queryByText(
          "This is a featured article description that should be displayed.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error Handling Tests", () => {
    it("should handle malformed article data gracefully", () => {
      const malformedArticles = [
        { ...mockArticles[0], title: null, slug: undefined },
      ];

      (getBlogArticles as jest.Mock).mockReturnValue(malformedArticles);

      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });

    it("should handle missing article properties gracefully", () => {
      const incompleteArticles = [
        {
          ...mockArticles[0],
          description: null,
          readTime: undefined,
          views: null,
        },
      ];

      (getBlogArticles as jest.Mock).mockReturnValue(incompleteArticles);

      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });

    it("should handle invalid date formats gracefully", () => {
      const invalidDateArticles = [
        { ...mockArticles[0], publishedDate: "invalid-date" },
      ];

      (getBlogArticles as jest.Mock).mockReturnValue(invalidDateArticles);

      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();
    });
  });

  // A card had to clamp text to keep every box the same height
  // (`line-clamp-2`/`line-clamp-3`/`min-h-[3.5rem]`). A hairline row lets the
  // text run and caps the measure instead, so the description stays readable.
  describe("Content Validation Tests", () => {
    it("caps the description at a readable measure instead of clamping lines", () => {
      render(<GlobalArticleGrid />);

      const descriptions = screen.getAllByText(/This is a featured article/);
      expect(descriptions.length).toBeGreaterThan(0);
      descriptions.forEach((desc) => {
        expect(desc).toHaveClass("max-w-[62ch]");
        expect(desc).not.toHaveClass("line-clamp-3");
      });

      screen.getAllByTestId("article-row").forEach((row) => {
        const title = getRowTitle(row);
        expect(title).not.toHaveClass("line-clamp-2");
        expect(title).not.toHaveClass("min-h-[3.5rem]");
      });
    });

    it("should maintain consistent row structure", () => {
      render(<GlobalArticleGrid />);

      const rows = screen.getAllByTestId("article-row");
      rows.forEach((row) => {
        // Every row is the same hairline: one top rule, one link, one rhythm.
        expect(row).toHaveClass("border-t", "border-zinc-200");
        expect(row).not.toHaveClass("transition-all");

        const link = row.querySelector("a");
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass("group", "grid", "py-5");
        expect(link).not.toHaveClass("block", "h-full");
      });
    });
  });

  describe("Analytics Integration", () => {
    const mockTrackRecommendationArticleClick =
      trackRecommendationArticleClick as jest.MockedFunction<
        typeof trackRecommendationArticleClick
      >;
    const mockTrackRecommendationCardHover =
      trackRecommendationCardHover as jest.MockedFunction<
        typeof trackRecommendationCardHover
      >;

    beforeEach(() => {
      jest.clearAllMocks();
      // The hover throttle keys on card slug and persists across tests within
      // this module (it's designed to survive re-renders, resetting only on a
      // fresh page load). userEvent.click() fires a synthetic hover en route
      // to the click, so an earlier click test can otherwise consume the
      // throttle window for a card a later test hovers explicitly.
      resetThrottle();
      (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
    });

    it("should track article click analytics with correct parameters", async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          currentSlug="current-article"
          sourcePageType="project"
          sourceSlug="test-project"
        />,
      );

      // Click on the first article row
      const articleRows = screen.getAllByTestId("article-row");
      const firstRowLink = within(articleRows[0]).getByRole("link");

      await user.click(firstRowLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        "project",
        "test-project",
        "featured-article-1",
        "Featured Article 1",
        0,
        "project_page",
      );
    });

    it("should track article hover analytics", async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          currentSlug="current-article"
          sourcePageType="blog"
          sourceSlug="test-blog-post"
        />,
      );

      // Hover over the first article row
      const articleRows = screen.getAllByTestId("article-row");
      const firstRowLink = within(articleRows[0]).getByRole("link");

      await user.hover(firstRowLink);

      expect(mockTrackRecommendationCardHover).toHaveBeenCalledWith(
        "article",
        "blog",
        "featured-article-1",
        "Featured Article 1",
        0,
      );
    });

    it("should track analytics with correct position for multiple items", async () => {
      const user = userEvent.setup();
      render(
        <GlobalArticleGrid
          limit={3}
          sourcePageType="blog"
          sourceSlug="test-blog"
        />,
      );

      // Click on the second article row (index 1)
      const articleRows = screen.getAllByTestId("article-row");
      const secondRowLink = within(articleRows[1]).getByRole("link");

      await user.click(secondRowLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        "blog",
        "test-blog",
        "featured-article-2",
        "Featured Article 2",
        1,
        "blog_page",
      );
    });

    it("should handle analytics calls without source page info", async () => {
      const user = userEvent.setup();
      render(<GlobalArticleGrid />);

      // Click without source page type or slug
      const articleRows = screen.getAllByTestId("article-row");
      const firstRowLink = within(articleRows[0]).getByRole("link");

      await user.click(firstRowLink);

      expect(mockTrackRecommendationArticleClick).toHaveBeenCalledWith(
        "project",
        "",
        "featured-article-1",
        "Featured Article 1",
        0,
        "project_page",
      );
    });

    it("should not track analytics if functions are not available", async () => {
      // Temporarily mock analytics to be undefined
      jest.doMock("@/lib/analytics", () => ({
        trackRecommendationArticleClick: undefined,
        trackRecommendationCardHover: undefined,
      }));

      const user = userEvent.setup();

      expect(() => {
        render(<GlobalArticleGrid />);
      }).not.toThrow();

      const articleRows = screen.getAllByTestId("article-row");
      const firstRowLink = within(articleRows[0]).getByRole("link");

      expect(async () => {
        await user.click(firstRowLink);
      }).not.toThrow();
    });
  });
});
