import { render, screen, fireEvent } from "@testing-library/react";
import { BlogArchiveAccordion } from "@/components/blog/blog-archive-accordion";
import { getBlogArticles } from "@/lib/utils/blog-data";

// Mock the blog data
jest.mock("@/lib/utils/blog-data", () => ({
  getBlogArticles: jest.fn(),
}));

const mockArticles = [
  {
    slug: "test-article-1",
    title: "Test Article 1",
    description: "This is the first test article description.",
    publishedDate: "2025-01-15",
    readTime: 5,
    category: "Development",
    tags: ["react", "testing"],
    views: 100,
    featured: true,
  },
  {
    slug: "test-article-2",
    title: "Test Article 2",
    description: "This is the second test article description.",
    publishedDate: "2024-12-20",
    readTime: 8,
    category: "Design",
    tags: ["design", "ui"],
    views: 200,
    featured: false,
  },
];

describe("BlogArchiveAccordion", () => {
  beforeEach(() => {
    (getBlogArticles as jest.Mock).mockReturnValue(mockArticles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render accordion with article titles", () => {
    render(<BlogArchiveAccordion />);

    expect(screen.getByText("Test Article 1")).toBeInTheDocument();
    expect(screen.getByText("Test Article 2")).toBeInTheDocument();
  });

  it("should show article metadata in trigger", () => {
    render(<BlogArchiveAccordion />);

    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(screen.getByText("8 min read")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("should expand article content when clicked", () => {
    render(<BlogArchiveAccordion />);

    // Initially, descriptions should not be visible
    expect(
      screen.queryByText("This is the first test article description."),
    ).not.toBeInTheDocument();

    // Click on the first article
    fireEvent.click(screen.getByText("Test Article 1"));

    // Description should now be visible
    expect(
      screen.getByText("This is the first test article description."),
    ).toBeInTheDocument();
  });

  it("should show published date in content", () => {
    render(<BlogArchiveAccordion />);

    fireEvent.click(screen.getByText("Test Article 1"));

    // The details block is a Terms List (DESIGN.md) now — a <dl> with a
    // hairline above every row — so the term is a <dt>, not "Published:".
    expect(screen.getByText("Published")).toBeInTheDocument();
    // Check if date is present with more flexible matching
    expect(
      screen.getByText((content, element) => {
        return (
          content.includes("2025") && element?.textContent?.includes("January")
        );
      }),
    ).toBeInTheDocument();
  });

  it("should show tags in content", () => {
    render(<BlogArchiveAccordion />);

    fireEvent.click(screen.getByText("Test Article 1"));

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
  });

  it("should not print fabricated view counts", () => {
    // lib/utils/blog-data.ts ships hardcoded `views` that no analytics source
    // produced. PRODUCT.md's first principle is credibility through proof,
    // which bans invented numbers, so the archive no longer renders them as
    // confirmed figures. The field survives only as a relative sort key.
    render(<BlogArchiveAccordion />);

    fireEvent.click(screen.getByText("Test Article 1"));

    expect(screen.queryByText(/views/i)).not.toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
  });

  it("should not mark featured articles with an amber chip", () => {
    // The One Family Rule: Live Amber means "this project is live and you can
    // open it today" and nothing else; a second use makes it mean nothing.
    const { container } = render(<BlogArchiveAccordion />);

    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/amber/);
  });

  it("should have read article link", () => {
    render(<BlogArchiveAccordion />);

    fireEvent.click(screen.getByText("Test Article 1"));

    const link = screen.getByRole("link", { name: /read article/i });
    expect(link).toHaveAttribute("href", "/blog/test-article-1");
  });

  it("should handle empty articles array", () => {
    (getBlogArticles as jest.Mock).mockReturnValue([]);

    render(<BlogArchiveAccordion />);

    expect(screen.getByText("No articles found.")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<BlogArchiveAccordion className="custom-class" />);

    const accordion = screen
      .getByText("Test Article 1")
      .closest('[class*="custom-class"]');
    expect(accordion).toBeInTheDocument();
  });

  it("should sort articles by publication date (newest first)", () => {
    render(<BlogArchiveAccordion />);

    const articles = screen.getAllByText(/Test Article/);
    expect(articles[0]).toHaveTextContent("Test Article 1"); // 2025-01-15 (newer)
    expect(articles[1]).toHaveTextContent("Test Article 2"); // 2024-12-20 (older)
  });

  it("should render identically whether or not an article carries views", () => {
    const articlesWithoutViews = [
      {
        ...mockArticles[0],
        views: undefined,
      },
    ];
    (getBlogArticles as jest.Mock).mockReturnValue(articlesWithoutViews);

    render(<BlogArchiveAccordion />);

    fireEvent.click(screen.getByText("Test Article 1"));

    expect(screen.queryByText(/views/)).not.toBeInTheDocument();
  });
});
