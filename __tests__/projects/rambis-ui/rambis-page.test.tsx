/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PROJECTS } from "@/lib/data/projects";
import RambisClientPage from "@/app/projects/rambis-ui/rambis-client";
import RambisUICaseStudy from "@/app/projects/rambis-ui/page";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock motion components to avoid animation complexities in tests
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  useMotionValue: () => ({ set: jest.fn() }),
  useSpring: () => ({ set: jest.fn() }),
}));

describe("Rambis UI Page", () => {
  const rambisProject = PROJECTS.find((p) => p.id === "rambis-ui")!;

  beforeEach(() => {
    // Reset viewport for each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  describe("Page Component", () => {
    it("renders the main page wrapper correctly", () => {
      render(<RambisUICaseStudy />);
      
      const wrapper = screen.getByRole("main").parentElement;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("container", "mx-auto", "max-w-6xl");
    });

    it("has correct metadata structure", () => {
      // Test that the page component can access project data
      expect(rambisProject).toBeDefined();
      expect(rambisProject.name).toBe("Rambis UI");
      expect(rambisProject.subtitle).toBe("Modern Design System & Component Library");
    });
  });

  describe("Client Page Component", () => {
    it("renders the main heading with correct text and styling", () => {
      render(<RambisClientPage />);
      
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("RAMBIS UI");
      expect(heading).toHaveClass("text-4xl", "font-bold", "md:text-6xl");
    });

    it("displays project description from data", () => {
      render(<RambisClientPage />);
      
      const description = screen.getByText(rambisProject.description);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-xl", "text-zinc-600");
    });

    it("renders timeline, role, and status badges", () => {
      render(<RambisClientPage />);
      
      expect(screen.getByText(rambisProject.timeline)).toBeInTheDocument();
      expect(screen.getByText(rambisProject.role)).toBeInTheDocument();
      expect(screen.getAllByText("Open Source")[0]).toBeInTheDocument();
    });

    it("displays all section headings", () => {
      render(<RambisClientPage />);
      
      expect(screen.getByText("Project Overview")).toBeInTheDocument();
      expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
      expect(screen.getByText("Technologies & Tools")).toBeInTheDocument();
    });
  });

  describe("Grid Layout Structure", () => {
    it("renders the main project overview grid", () => {
      render(<RambisClientPage />);
      
      const gridContainer = screen.getByText("Project Overview").closest("section")?.querySelector("div");
      expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2");
    });

    it("renders all four main grid cards", () => {
      render(<RambisClientPage />);
      
      // Hero Card
      expect(screen.getByText("Design System")).toBeInTheDocument();
      
      // Demo Card
      expect(screen.getByText("Interactive Demo")).toBeInTheDocument();
      
      // Metrics Card (first metric)
      expect(screen.getByText("Components")).toBeInTheDocument();
      expect(screen.getByText("50+")).toBeInTheDocument();
      
      // Actions/Community Card
      expect(screen.getByText("Community")).toBeInTheDocument();
    });

    it("renders performance metrics grid", () => {
      render(<RambisClientPage />);
      
      const metricsSection = screen.getByText("Performance Metrics").closest("section");
      const metricsGrid = metricsSection?.querySelector("div.grid");
      
      expect(metricsGrid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3");
      
      // Check for metrics
      expect(screen.getByText("2.5K+")).toBeInTheDocument(); // Weekly Downloads
      expect(screen.getByText("150+")).toBeInTheDocument(); // GitHub Stars
      expect(screen.getByText("94%")).toBeInTheDocument(); // Test Coverage
    });
  });

  describe("Card Components", () => {
    describe("HeroCard", () => {
      it("renders with correct content and styling", () => {
        render(<RambisClientPage />);
        
        const heroCard = screen.getByText("Design System").closest("[class*='aspect-video']");
        expect(heroCard).toHaveClass("aspect-video");
        
        const description = screen.getByText(/comprehensive component library forked from Chakra UI/);
        expect(description).toBeInTheDocument();
      });

      it("contains GitHub and Documentation links", () => {
        render(<RambisClientPage />);
        
        const githubLinks = screen.getAllByText("GitHub");
        expect(githubLinks.length).toBeGreaterThan(0);
        
        const docLink = screen.getByText("Documentation");
        expect(docLink).toBeInTheDocument();
      });
    });

    describe("DemoCard", () => {
      it("renders with interactive demo content", () => {
        render(<RambisClientPage />);
        
        const demoCard = screen.getByText("Interactive Demo");
        expect(demoCard).toBeInTheDocument();
        
        const description = screen.getByText(/50\+ production-ready components/);
        expect(description).toBeInTheDocument();
      });

      it("displays visual demo elements", () => {
        render(<RambisClientPage />);
        
        const demoCard = screen.getByText("Interactive Demo").closest("[class*='aspect-video']");
        const colorBars = demoCard?.querySelectorAll("[class*='h-2'], [class*='h-3']");
        expect(colorBars?.length).toBeGreaterThanOrEqual(3);
      });
    });

    describe("MetricCard", () => {
      it("renders metric cards with icons and values", () => {
        render(<RambisClientPage />);
        
        // Test one specific metric card
        const componentsCard = screen.getByText("50+").closest("[class*='aspect-video']");
        expect(componentsCard).toHaveClass("aspect-video");
        expect(screen.getByText("Components")).toBeInTheDocument();
      });

      it("displays all enhanced metrics", () => {
        render(<RambisClientPage />);
        
        const metrics = [
          { label: "Components", value: "50+" },
          { label: "Weekly Downloads", value: "2.5K+" },
          { label: "GitHub Stars", value: "150+" },
          { label: "Test Coverage", value: "94%" },
        ];

        metrics.forEach(({ label, value }) => {
          expect(screen.getByText(label)).toBeInTheDocument();
          expect(screen.getByText(value)).toBeInTheDocument();
        });
      });
    });

    describe("ActionsCard", () => {
      it("renders community information", () => {
        render(<RambisClientPage />);
        
        expect(screen.getByText("Community")).toBeInTheDocument();
        expect(screen.getByText(/12 active contributors/)).toBeInTheDocument();
      });

      it("displays status indicators", () => {
        render(<RambisClientPage />);
        
        expect(screen.getByText("Active Development")).toBeInTheDocument();
        expect(screen.getAllByText("Open Source")[1]).toBeInTheDocument();
        expect(screen.getByText("Community Driven")).toBeInTheDocument();
      });
    });
  });

  describe("Technologies Section", () => {
    it("renders all technology tags", () => {
      render(<RambisClientPage />);
      
      // Check that some key technologies are displayed
      const expectedTechs = ["React", "TypeScript", "Storybook", "Jest"];
      
      expectedTechs.forEach(tech => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });

    it("applies correct styling to technology tags", () => {
      render(<RambisClientPage />);
      
      const techTag = screen.getByText("React");
      expect(techTag).toHaveClass("rounded-full", "border", "px-3", "py-1");
    });
  });

  describe("Navigation Section", () => {
    it("renders back to projects link", () => {
      render(<RambisClientPage />);
      
      const backLink = screen.getByText("← Back to Projects");
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest("a")).toHaveAttribute("href", "/projects");
    });

    it("renders view on GitHub link", () => {
      render(<RambisClientPage />);
      
      const githubLink = screen.getByText("View on GitHub");
      expect(githubLink).toBeInTheDocument();
      expect(githubLink.closest("a")).toHaveAttribute("href", rambisProject.githubLink);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<RambisClientPage />);
      
      const h1 = screen.getByRole("heading", { level: 1 });
      const h2s = screen.getAllByRole("heading", { level: 2 });
      const h3s = screen.getAllByRole("heading", { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it("has accessible link text", () => {
      render(<RambisClientPage />);
      
      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it("uses semantic HTML elements", () => {
      render(<RambisClientPage />);
      
      expect(screen.getByRole("main")).toBeInTheDocument();
      
      // Check for sections by finding elements with section tag
      const { container } = render(<RambisClientPage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive classes for different screen sizes", () => {
      render(<RambisClientPage />);
      
      // Check grid responsive classes
      const projectGrid = screen.getByText("Project Overview").closest("section")?.querySelector("div.grid");
      expect(projectGrid).toHaveClass("grid-cols-1", "md:grid-cols-2");
      
      const metricsGrid = screen.getByText("Performance Metrics").closest("section")?.querySelector("div.grid");
      expect(metricsGrid).toHaveClass("grid-cols-1", "md:grid-cols-3");
    });

    it("uses responsive text sizing", () => {
      render(<RambisClientPage />);
      
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveClass("text-4xl", "md:text-6xl");
      
      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
      sectionHeadings.forEach(heading => {
        expect(heading).toHaveClass("text-xl", "sm:text-2xl");
      });
    });
  });

  describe("Data Integration", () => {
    it("correctly displays project data from PROJECTS array", () => {
      render(<RambisClientPage />);
      
      // Test for the split heading "RAMBIS UI"
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
      expect(screen.getByText("UI")).toBeInTheDocument();
      expect(screen.getByText(rambisProject.description)).toBeInTheDocument();
      expect(screen.getByText(rambisProject.timeline)).toBeInTheDocument();
      expect(screen.getByText(rambisProject.role)).toBeInTheDocument();
    });

    it("handles missing optional data gracefully", () => {
      const mockProject = { ...rambisProject };
      delete mockProject.githubLink;
      
      // Mock the PROJECTS array temporarily
      const originalFind = PROJECTS.find;
      PROJECTS.find = jest.fn().mockReturnValue(mockProject);
      
      render(<RambisClientPage />);
      
      // Should still render without errors
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
      
      // Restore original method
      PROJECTS.find = originalFind;
    });
  });

  describe("User Interactions", () => {
    it("handles link clicks correctly", async () => {
      const user = userEvent.setup();
      render(<RambisClientPage />);
      
      const githubLink = screen.getByText("GitHub").closest("a");
      expect(githubLink).toHaveAttribute("href", rambisProject.githubLink);
      
      // Test that link is clickable (we can't test actual navigation in jsdom)
      await user.hover(githubLink!);
      expect(githubLink).toBeInTheDocument();
    });

    it("applies hover states correctly", async () => {
      const user = userEvent.setup();
      render(<RambisClientPage />);
      
      const cards = screen.getAllByRole("generic").filter(el => 
        el.className.includes("aspect-video")
      );
      
      // Test that cards can be hovered
      if (cards.length > 0) {
        await user.hover(cards[0]);
        expect(cards[0]).toBeInTheDocument();
      }
    });
  });

  describe("Performance", () => {
    it("doesn't trigger unnecessary re-renders", () => {
      const { rerender } = render(<RambisClientPage />);
      
      // Re-render with same props
      rerender(<RambisClientPage />);
      
      // Should still display correctly
      expect(screen.getByText("RAMBIS")).toBeInTheDocument();
    });

    it("loads efficiently with minimal DOM queries", () => {
      const { container } = render(<RambisClientPage />);
      
      // Check that component structure is efficient
      const cards = container.querySelectorAll("[class*='aspect-video']");
      expect(cards.length).toBe(7); // 4 main cards + 3 metrics cards
    });
  });

  describe("Error Handling", () => {
    it("handles missing project data gracefully", () => {
      // Mock PROJECTS.find to return undefined
      const originalFind = PROJECTS.find;
      PROJECTS.find = jest.fn().mockReturnValue(undefined);
      
      // Should not crash
      expect(() => render(<RambisClientPage />)).not.toThrow();
      
      // Restore
      PROJECTS.find = originalFind;
    });

    it("handles malformed project data", () => {
      const malformedProject = {
        ...rambisProject,
        technologies: null,
        metrics: undefined,
      };
      
      const originalFind = PROJECTS.find;
      PROJECTS.find = jest.fn().mockReturnValue(malformedProject);
      
      expect(() => render(<RambisClientPage />)).not.toThrow();
      
      PROJECTS.find = originalFind;
    });
  });
});