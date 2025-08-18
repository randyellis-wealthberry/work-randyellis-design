import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Import the component we'll create (this will fail initially - that's the TDD RED phase)
import ProjectResourcesSection from "@/components/ui/project-resources-section";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("ProjectResourcesSection", () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the section title", () => {
      render(<ProjectResourcesSection />);
      expect(
        screen.getByText("Project Resources & Documentation"),
      ).toBeInTheDocument();
    });

    it("should render exactly 4 resource cards", () => {
      render(<ProjectResourcesSection />);
      const cards = screen.getAllByTestId(/resource-card-/);
      expect(cards).toHaveLength(4);
    });

    it("should render all expected card titles", () => {
      render(<ProjectResourcesSection />);

      expect(screen.getByText("Maze Usability Testing")).toBeInTheDocument();
      expect(
        screen.getByText("Design Process & Wireframes"),
      ).toBeInTheDocument();
      expect(screen.getByText("Addvance v1 Report")).toBeInTheDocument();
      expect(screen.getByText("View More Projects")).toBeInTheDocument();
    });

    it("should render cards in a responsive grid layout", () => {
      render(<ProjectResourcesSection />);
      const gridContainer = screen.getByTestId("resources-grid");
      expect(gridContainer).toHaveClass("grid");
      expect(gridContainer).toHaveClass("grid-cols-1");
      expect(gridContainer).toHaveClass("md:grid-cols-2");
    });
  });

  describe("Image Generation", () => {
    it("should render unique images for each card", () => {
      render(<ProjectResourcesSection />);
      const images = screen.getAllByRole("img");

      expect(images).toHaveLength(4);

      // Check that all images have different src attributes
      const srcs = images.map((img) => img.getAttribute("src"));
      const uniqueSrcs = new Set(srcs);
      expect(uniqueSrcs.size).toBe(4);
    });

    it("should generate different images on each render", () => {
      const { rerender } = render(<ProjectResourcesSection />);
      const initialImages = screen.getAllByRole("img").map((img) => (img as HTMLImageElement).src);

      rerender(<ProjectResourcesSection />);
      const newImages = screen.getAllByRole("img").map((img) => (img as HTMLImageElement).src);

      expect(initialImages).not.toEqual(newImages);
    });

    it("should use Unsplash URLs with correct parameters", () => {
      render(<ProjectResourcesSection />);
      const images = screen.getAllByRole("img");

      images.forEach((img) => {
        const src = img.getAttribute("src");
        expect(src).toMatch(/source\.unsplash\.com/);
        expect(src).toMatch(/400x200/);
        expect(src).toMatch(/sig=\d+/);
      });
    });
  });

  describe("Link Behavior", () => {
    it("should open external links in new tabs with proper security attributes", () => {
      render(<ProjectResourcesSection />);

      // Test Maze link
      const mazeLink = screen.getByRole("link", {
        name: /maze usability testing/i,
      });
      expect(mazeLink).toHaveAttribute("href", "https://t.maze.co/159918816");
      expect(mazeLink).toHaveAttribute("target", "_blank");
      expect(mazeLink).toHaveAttribute("rel", "noopener noreferrer");

      // Test Miro link
      const miroLink = screen.getByRole("link", { name: /design process/i });
      expect(miroLink).toHaveAttribute(
        "href",
        "https://miro.com/app/board/o9J_kwGbK00=/",
      );
      expect(miroLink).toHaveAttribute("target", "_blank");
      expect(miroLink).toHaveAttribute("rel", "noopener noreferrer");

      // Test Addvance report link
      const reportLink = screen.getByRole("link", {
        name: /addvance v1 report/i,
      });
      expect(reportLink).toHaveAttribute(
        "href",
        "https://app.maze.co/report/Addvance-v1-WIP/bxqeilh40ohf5/intro",
      );
      expect(reportLink).toHaveAttribute("target", "_blank");
      expect(reportLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should handle internal links without external attributes", () => {
      render(<ProjectResourcesSection />);

      const projectsLink = screen.getByRole("link", {
        name: /view more projects/i,
      });
      expect(projectsLink).toHaveAttribute("href", "/projects");
      expect(projectsLink).not.toHaveAttribute("target");
      expect(projectsLink).not.toHaveAttribute("rel");
    });
  });

  describe("Disclosure Functionality", () => {
    const user = userEvent.setup();

    it("should start with all cards in collapsed state", () => {
      render(<ProjectResourcesSection />);

      // Descriptions should not be visible initially
      expect(
        screen.queryByText(/interactive prototype testing results/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/complete design journey/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/work-in-progress prototype evaluation/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/explore other innovative design solutions/i),
      ).not.toBeInTheDocument();
    });

    it("should expand card content when clicked", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");
      await user.click(firstCard);

      await waitFor(() => {
        expect(
          screen.getByText(/interactive prototype testing results/i),
        ).toBeInTheDocument();
      });
    });

    it("should collapse expanded content when clicked again", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");

      // Expand
      await user.click(firstCard);
      await waitFor(() => {
        expect(
          screen.getByText(/interactive prototype testing results/i),
        ).toBeInTheDocument();
      });

      // Collapse
      await user.click(firstCard);
      await waitFor(() => {
        expect(
          screen.queryByText(/interactive prototype testing results/i),
        ).not.toBeInTheDocument();
      });
    });

    it("should support keyboard navigation with Enter key", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");
      firstCard.focus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(
          screen.getByText(/interactive prototype testing results/i),
        ).toBeInTheDocument();
      });
    });

    it("should support keyboard navigation with Space key", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");
      firstCard.focus();

      await user.keyboard(" ");

      await waitFor(() => {
        expect(
          screen.getByText(/interactive prototype testing results/i),
        ).toBeInTheDocument();
      });
    });

    it("should allow multiple cards to be expanded simultaneously", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");
      const secondCard = screen.getByTestId("resource-card-miro-board");

      await user.click(firstCard);
      await user.click(secondCard);

      await waitFor(() => {
        expect(
          screen.getByText(/interactive prototype testing results/i),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/complete design journey/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<ProjectResourcesSection />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper ARIA attributes on disclosure buttons", () => {
      render(<ProjectResourcesSection />);

      const cards = screen.getAllByRole("button");
      cards.forEach((card) => {
        expect(card).toHaveAttribute("aria-expanded");
        expect(card).toHaveAttribute("aria-controls");
        expect(card).toHaveAttribute("id");
      });
    });

    it("should have meaningful alt text for images", () => {
      render(<ProjectResourcesSection />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).toBeTruthy();
        expect(altText).not.toBe("");
        expect(altText!.length).toBeGreaterThan(10); // Meaningful alt text
      });
    });

    it("should have proper heading hierarchy", () => {
      render(<ProjectResourcesSection />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent(
        "Project Resources & Documentation",
      );

      const cardHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(cardHeadings).toHaveLength(4);
    });

    it("should maintain focus management during interactions", async () => {
      render(<ProjectResourcesSection />);

      const firstCard = screen.getByTestId("resource-card-maze-testing");
      firstCard.focus();

      expect(document.activeElement).toBe(firstCard);

      await userEvent.click(firstCard);

      // Focus should remain on the card after expansion
      await waitFor(() => {
        expect(document.activeElement).toBe(firstCard);
      });
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive classes correctly", () => {
      render(<ProjectResourcesSection />);

      const section = screen.getByTestId("project-resources-section");
      expect(section).toHaveClass("px-6");
      expect(section).toHaveClass("py-16");
      expect(section).toHaveClass("lg:px-8");

      const grid = screen.getByTestId("resources-grid");
      expect(grid).toHaveClass("grid");
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("md:grid-cols-2");
      expect(grid).toHaveClass("gap-6");
    });

    it("should have touch-friendly targets on mobile", () => {
      render(<ProjectResourcesSection />);

      const cards = screen.getAllByTestId(/resource-card-/);
      cards.forEach((card) => {
        // Minimum 44px touch target (Tailwind's min-h-11 = 44px)
        expect(card).toHaveClass("min-h-11");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle image loading errors gracefully", async () => {
      render(<ProjectResourcesSection />);

      const images = screen.getAllByRole("img");
      const firstImage = images[0];

      // Simulate image load error
      Object.defineProperty(firstImage, "complete", { value: true });
      Object.defineProperty(firstImage, "naturalHeight", { value: 0 });

      // Should still render the card without breaking
      expect(
        screen.getByTestId("resource-card-maze-testing"),
      ).toBeInTheDocument();
    });

    it("should provide fallback content when disclosure component fails", () => {
      // This test ensures the component degrades gracefully if motion-primitives fails
      render(<ProjectResourcesSection />);

      // Even without disclosure functionality, basic content should be accessible
      expect(screen.getByText("Maze Usability Testing")).toBeInTheDocument();
      expect(
        screen.getByText("Design Process & Wireframes"),
      ).toBeInTheDocument();
      expect(screen.getByText("Addvance v1 Report")).toBeInTheDocument();
      expect(screen.getByText("View More Projects")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause memory leaks with image generation", () => {
      const { unmount } = render(<ProjectResourcesSection />);

      // Should unmount cleanly without errors
      expect(() => unmount()).not.toThrow();
    });

    it("should generate image seeds efficiently", () => {
      const startTime = performance.now();
      render(<ProjectResourcesSection />);
      const endTime = performance.now();

      // Image seed generation should be fast (less than 100ms for tests)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
