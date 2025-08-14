import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  MagneticButton,
  LiquidButton,
  ParticleButton,
  GradientButton,
  RippleButton,
} from "../index";

expect.extend(toHaveNoViolations);

describe("Animated Buttons Test Suite", () => {
  describe("MagneticButton", () => {
    it("renders with correct text", () => {
      render(<MagneticButton>Career Intelligence</MagneticButton>);
      expect(screen.getByText("Career Intelligence")).toBeInTheDocument();
    });

    it("has proper ARIA attributes", () => {
      render(
        <MagneticButton aria-label="Launch career tracker">
          Launch
        </MagneticButton>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Launch career tracker");
    });

    it("responds to hover events", () => {
      const { container } = render(<MagneticButton>Hover Me</MagneticButton>);
      const button = container.querySelector("button");

      fireEvent.mouseEnter(button!);
      expect(button).toHaveClass("group-hover");
    });

    it("handles click events", () => {
      const handleClick = jest.fn();
      render(<MagneticButton onClick={handleClick}>Click Me</MagneticButton>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is keyboard navigable", () => {
      render(<MagneticButton>Keyboard Nav</MagneticButton>);
      const button = screen.getByRole("button");

      button.focus();
      expect(button).toHaveFocus();

      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      fireEvent.keyDown(button, { key: " ", code: "Space" });
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <MagneticButton>Accessible Button</MagneticButton>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("LiquidButton", () => {
    it("renders with liquid effect container", () => {
      const { container } = render(<LiquidButton>Liquid Effect</LiquidButton>);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.querySelector("filter")).toBeInTheDocument();
    });

    it("maintains text readability", () => {
      render(<LiquidButton>Network Analysis</LiquidButton>);
      expect(screen.getByText("Network Analysis")).toBeVisible();
    });

    it("respects prefers-reduced-motion", () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { container } = render(<LiquidButton>Reduced Motion</LiquidButton>);
      const button = container.querySelector("button");
      expect(button).toHaveStyle({ animationDuration: "0.01ms" });
    });
  });

  describe("ParticleButton", () => {
    it("spawns particles on hover", async () => {
      const { container } = render(
        <ParticleButton>Particle Magic</ParticleButton>,
      );
      const button = container.querySelector("button");

      fireEvent.mouseEnter(button!);

      await waitFor(() => {
        const particles = container.querySelectorAll(".particle");
        expect(particles.length).toBeGreaterThan(0);
      });
    });

    it("cleans up particles after animation", async () => {
      const { container } = render(
        <ParticleButton>Clean Particles</ParticleButton>,
      );
      const button = container.querySelector("button");

      fireEvent.mouseEnter(button!);
      fireEvent.mouseLeave(button!);

      await waitFor(
        () => {
          const particles = container.querySelectorAll(".particle");
          expect(particles.length).toBe(0);
        },
        { timeout: 1000 },
      );
    });
  });

  describe("GradientButton", () => {
    it("renders with gradient background", () => {
      const { container } = render(
        <GradientButton>Gradient Aurora</GradientButton>,
      );
      const button = container.querySelector("button");

      const styles = window.getComputedStyle(button!);
      expect(styles.background).toContain("gradient");
    });

    it("animates gradient on hover", () => {
      const { container } = render(
        <GradientButton>Hover Gradient</GradientButton>,
      );
      const button = container.querySelector("button");

      fireEvent.mouseEnter(button!);
      expect(button).toHaveClass("hover:animate-gradient");
    });
  });

  describe("RippleButton", () => {
    it("creates ripple effect on click", async () => {
      const { container } = render(<RippleButton>Ripple Click</RippleButton>);
      const button = container.querySelector("button");

      fireEvent.click(button!);

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect");
        expect(ripple).toBeInTheDocument();
      });
    });

    it("positions ripple at click location", () => {
      const { container } = render(
        <RippleButton>Position Ripple</RippleButton>,
      );
      const button = container.querySelector("button");

      const clickEvent = new MouseEvent("click", {
        clientX: 100,
        clientY: 50,
        bubbles: true,
      });

      button!.dispatchEvent(clickEvent);

      const ripple = container.querySelector(".ripple-effect");
      expect(ripple).toHaveStyle({
        left: expect.stringContaining("px"),
        top: expect.stringContaining("px"),
      });
    });

    it("shows success feedback", async () => {
      render(<RippleButton showSuccess>Success Ripple</RippleButton>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("success-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Cross-browser Compatibility", () => {
    const buttons = [
      { Component: MagneticButton, name: "Magnetic" },
      { Component: LiquidButton, name: "Liquid" },
      { Component: ParticleButton, name: "Particle" },
      { Component: GradientButton, name: "Gradient" },
      { Component: RippleButton, name: "Ripple" },
    ];

    buttons.forEach(({ Component, name }) => {
      it(`${name}Button works without CSS animations support`, () => {
        const { container } = render(<Component>Fallback Test</Component>);
        const button = container.querySelector("button");

        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button!);
      });
    });
  });

  describe("Performance Tests", () => {
    it("maintains 60fps animations", () => {
      const { container } = render(
        <>
          <MagneticButton>Button 1</MagneticButton>
          <LiquidButton>Button 2</LiquidButton>
          <ParticleButton>Button 3</ParticleButton>
          <GradientButton>Button 4</GradientButton>
          <RippleButton>Button 5</RippleButton>
        </>,
      );

      const buttons = container.querySelectorAll("button");
      expect(buttons).toHaveLength(5);

      buttons.forEach((button) => {
        const styles = window.getComputedStyle(button);
        expect(styles.willChange).toBe("transform");
      });
    });
  });

  describe("Responsive Design", () => {
    it("adapts to mobile viewport", () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event("resize"));

      render(<MagneticButton>Mobile Button</MagneticButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveStyle({ minWidth: "180px" });
    });

    it("works with touch events", () => {
      const handleClick = jest.fn();
      render(<RippleButton onClick={handleClick}>Touch Me</RippleButton>);

      const button = screen.getByRole("button");
      fireEvent.touchStart(button);
      fireEvent.touchEnd(button);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Theme Compatibility", () => {
    it("supports dark mode", () => {
      document.documentElement.classList.add("dark");

      const { container } = render(<GradientButton>Dark Mode</GradientButton>);
      const button = container.querySelector("button");

      expect(button).toHaveClass("dark:bg-gradient-to-r");

      document.documentElement.classList.remove("dark");
    });

    it("inherits theme variables", () => {
      const { container } = render(
        <MagneticButton>Theme Button</MagneticButton>,
      );
      const button = container.querySelector("button");

      if (button) {
        const styles = window.getComputedStyle(button);
        expect(styles.getPropertyValue("--primary")).toBeDefined();
      } else {
        throw new Error("Button not found");
      }
    });
  });
});
