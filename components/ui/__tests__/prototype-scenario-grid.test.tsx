import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { PrototypeScenarioGrid } from "../prototype-scenario-grid";

expect.extend(toHaveNoViolations);

// Mock Next.js Link
jest.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      ...props
    }: Record<string, unknown> & {
      children: React.ReactNode;
      href: string;
    }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: Record<string, unknown> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("PrototypeScenarioGrid", () => {
  it("renders all 4 cards in a grid", () => {
    render(<PrototypeScenarioGrid />);

    expect(screen.getByText("Information Architecture")).toBeInTheDocument();
    expect(screen.getByText("Usability Test")).toBeInTheDocument();
    expect(screen.getByText("Test Results")).toBeInTheDocument();
    expect(screen.getByText("More Projects")).toBeInTheDocument();
  });

  it("renders cards in a 2x2 grid layout", () => {
    const { container } = render(<PrototypeScenarioGrid />);
    const grid = container.querySelector(".grid");

    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
  });

  it("first three cards open in new tab", () => {
    render(<PrototypeScenarioGrid />);

    const sidemapLink = screen.getByRole("link", {
      name: /information architecture/i,
    });
    const testLink = screen.getByRole("link", { name: /usability test/i });
    const reportLink = screen.getByRole("link", { name: /test results/i });

    expect(sidemapLink).toHaveAttribute("target", "_blank");
    expect(sidemapLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(testLink).toHaveAttribute("target", "_blank");
    expect(testLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(reportLink).toHaveAttribute("target", "_blank");
    expect(reportLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("fourth card (More Projects) opens in same tab", () => {
    render(<PrototypeScenarioGrid />);

    const projectsLink = screen.getByRole("link", { name: /more projects/i });

    expect(projectsLink).not.toHaveAttribute("target");
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("has correct URLs for all cards", () => {
    render(<PrototypeScenarioGrid />);

    const sidemapLink = screen.getByRole("link", {
      name: /information architecture/i,
    });
    const testLink = screen.getByRole("link", { name: /usability test/i });
    const reportLink = screen.getByRole("link", { name: /test results/i });
    const projectsLink = screen.getByRole("link", { name: /more projects/i });

    expect(sidemapLink).toHaveAttribute(
      "href",
      "https://miro.com/app/board/o9J_kwGbK00=/",
    );
    expect(testLink).toHaveAttribute("href", "https://t.maze.co/159918816");
    expect(reportLink).toHaveAttribute(
      "href",
      "https://app.maze.co/report/Addvance-v1-WIP/bxqeilh40ohf5/intro",
    );
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("displays cursor labels on hover", () => {
    const { container } = render(<PrototypeScenarioGrid />);
    const firstCard = container.querySelector(".group");

    if (firstCard) {
      fireEvent.mouseEnter(firstCard);
      // Cursor component should be visible
      expect(container.querySelector(".cursor-label")).toBeTruthy();
    }
  });

  it("each card has abstract gradient background", () => {
    const { container } = render(<PrototypeScenarioGrid />);
    const cards = container.querySelectorAll(".abstract-card");

    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      const styles = window.getComputedStyle(card);
      expect(styles.background).toBeTruthy();
    });
  });

  it("is keyboard navigable", () => {
    render(<PrototypeScenarioGrid />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("tabIndex", "0");
      // Simulate keyboard navigation
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  it("has proper ARIA labels", () => {
    render(<PrototypeScenarioGrid />);

    const sidemapLink = screen.getByRole("link", {
      name: /information architecture/i,
    });
    const testLink = screen.getByRole("link", { name: /usability test/i });

    expect(sidemapLink).toHaveAttribute("aria-label");
    expect(testLink).toHaveAttribute("aria-label");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PrototypeScenarioGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("is responsive on mobile", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    const { container } = render(<PrototypeScenarioGrid />);
    const grid = container.querySelector(".grid");

    expect(grid).toHaveClass("grid-cols-1");
  });

  it("is responsive on tablet", () => {
    window.innerWidth = 768;
    window.dispatchEvent(new Event("resize"));

    const { container } = render(<PrototypeScenarioGrid />);
    const grid = container.querySelector(".grid");

    expect(grid).toHaveClass("md:grid-cols-2");
  });

  it("handles hover interactions", () => {
    const { container } = render(<PrototypeScenarioGrid />);
    const firstCard = container.querySelector(".group");

    if (firstCard) {
      fireEvent.mouseEnter(firstCard);
      // Check for hover state changes
      expect(firstCard).toHaveClass("hover:scale-105");

      fireEvent.mouseLeave(firstCard);
      // Check hover state removed
    }
  });
});
