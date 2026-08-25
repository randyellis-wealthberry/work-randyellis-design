import { render, screen } from "@testing-library/react";
import BlogPage from "@/app/blog/page";

// Mock the blog data
jest.mock("@/lib/utils/blog-data", () => ({
  getBlogArticles: jest.fn(() => [
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
  ]),
  getBlogArchiveData: jest.fn(() => ({
    articles: [
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
    ],
    categories: ["Development", "Design"],
    totalCount: 2,
  })),
}));

describe("BlogPage", () => {
  it("should render page title", () => {
    render(<BlogPage />);

    expect(screen.getByText("Blog Archive")).toBeInTheDocument();
  });

  it("should render page description", () => {
    render(<BlogPage />);

    expect(
      screen.getByText(/explore insights, tutorials, and thoughts/i),
    ).toBeInTheDocument();
  });

  it("should render blog archive accordion", () => {
    render(<BlogPage />);

    // Section labels are sentence case (DESIGN.md Typography → Label:
    // "Sentence case — never uppercase, never letterspaced into a kicker").
    expect(screen.getByText("All articles")).toBeInTheDocument();
    expect(screen.getAllByText("Test Article 1")).toHaveLength(2); // accordion + recommendations
    expect(screen.getAllByText("Test Article 2")).toHaveLength(2); // accordion + recommendations
  });

  it("should render global recommendations grid", () => {
    render(<BlogPage />);

    expect(screen.getByText("Latest articles")).toBeInTheDocument();
  });

  it("should show article count in description", () => {
    render(<BlogPage />);

    // The count is its own `tabular-nums` span (The Tabular Figures Rule), so
    // it no longer shares a text node with the word "articles".
    const lead = screen.getByText(/explore insights/i);
    expect(lead).toHaveTextContent(/2 articles/i);
    expect(lead.querySelector(".tabular-nums")).toHaveTextContent("2");
  });

  it("should show categories in description", () => {
    render(<BlogPage />);

    // Check for categories in the description text
    expect(screen.getByText(/Development, and Design/)).toBeInTheDocument();
  });

  it("should have proper SEO metadata structure", () => {
    render(<BlogPage />);

    // Check for structured layout
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("should use proper semantic HTML structure", () => {
    render(<BlogPage />);

    // Check for header section
    const header = screen.getByText("Blog Archive").closest("header");
    expect(header).toBeInTheDocument();

    // Check for main content
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("should not re-declare the site container inside RouteContainer", () => {
    const { container } = render(<BlogPage />);

    // The Whole-Chrome Rule (DESIGN.md): the route's measure and gutters are
    // owned by RouteContainer, which already wraps header, content and footer.
    // The page's own `container mx-auto px-4` nested a second gutter inside it.
    expect(screen.getByText("Blog Archive").closest(".container")).toBeNull();
    expect(container.querySelector(".container")).toBeNull();

    // The page's landmark is the skip-link target and themes the browser's
    // own surfaces (The Browser Surfaces Rule).
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveClass("selection:bg-zinc-900", "caret-zinc-900");
  });

  it("should open every movement through the shared section chrome", () => {
    const { container } = render(<BlogPage />);

    // Vertical rhythm is the documented 80px between movements, carried by the
    // SECTION constant — not a `space-y` on the container, which outranks the
    // section's own margin and would flatten it to 48px.
    const main = screen.getByRole("main");
    expect(main.className).not.toMatch(/\bspace-y-/);

    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((section) => {
      expect(section).toHaveClass(
        "mt-20",
        "border-t",
        "border-zinc-900",
        "pt-10",
      );
    });
  });
});
