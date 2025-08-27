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

    // Check for "All Articles" section heading which indicates accordion presence
    expect(screen.getByText("All Articles")).toBeInTheDocument();
    expect(screen.getAllByText("Test Article 1")).toHaveLength(2); // accordion + recommendations
    expect(screen.getAllByText("Test Article 2")).toHaveLength(2); // accordion + recommendations
  });

  it("should render global recommendations grid", () => {
    render(<BlogPage />);

    expect(screen.getByText("Latest Articles")).toBeInTheDocument();
  });

  it("should show article count in description", () => {
    render(<BlogPage />);

    expect(screen.getByText(/2 articles/i)).toBeInTheDocument();
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

  it("should render responsive layout", () => {
    render(<BlogPage />);

    // Check for container div instead of main element
    const container = screen.getByText("Blog Archive").closest(".container");
    expect(container).toBeInTheDocument();
  });

  it("should handle spacing and padding correctly", () => {
    render(<BlogPage />);

    const main = screen.getByRole("main");
    expect(main).toHaveClass("space-y-12");
  });
});
