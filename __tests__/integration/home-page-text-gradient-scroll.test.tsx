import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock Next.js components
jest.mock("next/image", () => {
  return function MockImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} />;
  };
});

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock analytics functions
jest.mock("@/lib/analytics", () => ({
  trackProjectHover: jest.fn(),
  trackProjectView: jest.fn(),
  trackContactIntent: jest.fn(),
}));

// Mock data imports
jest.mock("@/lib/data", () => ({
  WORK_EXPERIENCE: [
    {
      id: "1",
      title: "Test Job",
      company: "Test Company",
      start: "2023",
      end: "2024",
      link: "https://test.com"
    }
  ],
  BLOG_POSTS: [
    {
      uid: "1",
      title: "Test Blog Post",
      description: "Test description",
      link: "/blog/test"
    }
  ],
  getEmail: () => "test@example.com",
  SOCIAL_LINKS: [
    {
      label: "GitHub",
      link: "https://github.com/test"
    }
  ],
}));

jest.mock("@/lib/data/projects", () => ({
  PROJECTS: [
    {
      id: "1",
      name: "Test Project",
      slug: "test-project",
      description: "Test description",
      thumbnail: "/test-thumbnail.jpg"
    }
  ],
}));

jest.mock("@/lib/project-utils", () => ({
  getRandomProjects: jest.fn(() => [
    {
      id: "1",
      name: "Test Project",
      slug: "test-project",
      description: "Test description",
      thumbnail: "/test-thumbnail.jpg"
    }
  ]),
}));

jest.mock("@/lib/video-utils", () => ({
  isVideoUrl: jest.fn(() => false),
}));

describe("Home Page TextGradientScroll Integration", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("renders without crashing with TextGradientScroll components", () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<HomePage />);
    
    // Should not have any console errors
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it("renders main content structure", () => {
    render(<HomePage />);
    
    // Should render main sections
    expect(screen.getByRole("main")).toBeInTheDocument();
    
    // Should render key text content that will be enhanced with TextGradientScroll
    expect(screen.getByText(/product design strategist/)).toBeInTheDocument();
  });

  it("maintains responsive layout with new components", () => {
    render(<HomePage />);
    
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveClass("space-y-32", "sm:space-y-24");
  });

  it("preserves existing navigation and sections", () => {
    render(<HomePage />);
    
    // Check for existing section headings that should still be present
    expect(screen.getByText(/Core Ideologies/)).toBeInTheDocument();
    expect(screen.getByText(/Selected Projects/)).toBeInTheDocument();
    expect(screen.getByText(/Recent Work Experience/)).toBeInTheDocument();
    expect(screen.getByText(/Connect/)).toBeInTheDocument();
  });

  it("handles motion components properly", () => {
    render(<HomePage />);
    
    // Motion components should render with proper data attributes
    const motionElements = document.querySelectorAll('[data-motion-component]');
    expect(motionElements.length).toBeGreaterThan(0);
  });

  it("maintains accessibility with new components", () => {
    render(<HomePage />);
    
    // Should have proper semantic structure
    expect(screen.getByRole("main")).toBeInTheDocument();
    
    // Should have screen reader content
    expect(screen.getByText(/Randy Ellis - AI Product Design Engineer Portfolio/)).toBeInTheDocument();
  });

  it("preserves existing interactive elements", () => {
    render(<HomePage />);
    
    // Should have links that are still functional
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    
    // Should have email link
    const emailLink = screen.getByText("test@example.com");
    expect(emailLink.closest("a")).toHaveAttribute("href", "mailto:test@example.com");
  });

  describe("Performance Considerations", () => {
    it("renders efficiently with new scroll components", () => {
      const startTime = performance.now();
      render(<HomePage />);
      const renderTime = performance.now() - startTime;
      
      // Should render within reasonable time even with new components
      expect(renderTime).toBeLessThan(1000);
    });

    it("does not create excessive DOM nodes", () => {
      render(<HomePage />);
      
      // Count DOM nodes to ensure we're not creating too many
      const allElements = document.querySelectorAll("*");
      
      // Should be reasonable number of elements (less than 1000 for a portfolio)
      expect(allElements.length).toBeLessThan(1000);
    });
  });

  describe("Responsive Behavior", () => {
    it("maintains mobile-first responsive classes", () => {
      render(<HomePage />);
      
      // Check that responsive grid classes are maintained
      const gridElements = document.querySelectorAll('.grid-cols-1');
      expect(gridElements.length).toBeGreaterThan(0);
      
      const responsiveElements = document.querySelectorAll('.sm\\:grid-cols-2');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });
  });

  describe("Animation Integration", () => {
    it("does not conflict with existing motion components", () => {
      render(<HomePage />);
      
      // Should render motion sections without errors
      const motionSections = document.querySelectorAll('[data-motion-component="section"]');
      expect(motionSections.length).toBeGreaterThan(0);
      
      // Should render motion main element
      const motionMain = document.querySelector('[data-motion-component="main"]');
      expect(motionMain).toBeInTheDocument();
    });
  });
});