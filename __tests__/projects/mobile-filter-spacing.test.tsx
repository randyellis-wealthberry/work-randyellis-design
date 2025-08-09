import { render, screen } from "@testing-library/react";
import ProjectsClient from "@/app/projects/projects-client";

// Mock motion components to avoid animation issues in tests
jest.mock("motion/react", () => ({
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock project data
jest.mock("@/lib/data/projects", () => ({
  PROJECTS: [
    {
      id: "1",
      name: "Test Project",
      slug: "test-project",
      description: "A test project",
      category: "Web Development",
      technologies: ["React", "TypeScript"],
      timeline: "2024",
      status: "completed",
      featured: true,
      link: "#",
      video: "/test-video.mp4",
      images: [],
      tags: [],
      longDescription: "Test description",
    },
  ],
}));

describe("Projects Page Mobile Filter Spacing", () => {
  beforeEach(() => {
    render(<ProjectsClient />);
  });

  describe("Mobile Filter Layout", () => {
    it("should render the filter tabs with proper mobile classes", () => {
      const tabsList = screen.getByRole("tablist");
      expect(tabsList).toBeInTheDocument();

      // Check that the TabsList has the updated responsive classes
      expect(tabsList).toHaveClass(
        "grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-1",
      );
    });

    it("should render all project category filters", () => {
      const categories = [
        "All",
        "Enterprise (SaaS)",
        "Mobile App",
        "Web Development",
        "Design Systems",
        "UI/UX",
        "AI/ML",
      ];

      categories.forEach((category) => {
        expect(screen.getByRole("tab", { name: category })).toBeInTheDocument();
      });
    });

    it("should have proper touch target sizing for mobile", () => {
      const tabs = screen.getAllByRole("tab");

      tabs.forEach((tab) => {
        // Check that tabs have minimum touch target height classes
        expect(tab).toHaveClass("min-h-[44px] sm:min-h-[36px]");
        expect(tab).toHaveClass("py-2.5 px-3 sm:py-1");
      });
    });

    it("should have appropriate text sizing", () => {
      const tabs = screen.getAllByRole("tab");

      tabs.forEach((tab) => {
        expect(tab).toHaveClass("text-xs");
      });
    });

    it("should have proper spacing between filter and content", () => {
      const tabContent = screen.getByRole("tabpanel");
      expect(tabContent).toHaveClass("mt-6 sm:mt-8");
    });
  });

  describe("Accessibility", () => {
    it("should maintain proper ARIA attributes", () => {
      const tabsList = screen.getByRole("tablist");
      const tabs = screen.getAllByRole("tab");
      const tabPanel = screen.getByRole("tabpanel");

      expect(tabsList).toBeInTheDocument();
      expect(tabs.length).toBeGreaterThan(0);
      expect(tabPanel).toBeInTheDocument();

      // Ensure first tab is selected by default
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("should support keyboard navigation with proper roles", () => {
      const tabs = screen.getAllByRole("tab");

      // All tabs should have proper role for screen readers
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute("role", "tab");
      });

      // Should have more than one tab for navigation
      expect(tabs.length).toBeGreaterThan(1);
    });
  });
});
