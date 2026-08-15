import { render, screen, fireEvent } from "@testing-library/react";
import WaffleClientPage from "@/app/projects/waffle/waffle-client";

// motion/react is globally mocked via jest.config.js moduleNameMapper
// (__mocks__/motion/react.js) — no inline mock needed here.

const mockTrackEvent = jest.fn();

jest.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

describe("Waffle Product Page", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
    render(<WaffleClientPage />);
  });

  describe("Hero", () => {
    it("renders the H1 'Waffle'", () => {
      expect(
        screen.getByRole("heading", { level: 1, name: "Waffle" }),
      ).toBeInTheDocument();
    });

    it("renders the one-liner subhead", () => {
      expect(
        screen.getByText(/interview scorecard generator/i),
      ).toBeInTheDocument();
    });

    it("renders a 'Live Product' badge", () => {
      expect(screen.getByText("Live Product")).toBeInTheDocument();
    });

    it("renders Randy's build-credit role line", () => {
      expect(
        screen.getByText(/Designed and built end-to-end by Randy Ellis/i),
      ).toBeInTheDocument();
    });
  });

  describe("Section headings", () => {
    it.each([
      "Key Features",
      "How It Works",
      "See it in action",
      "Ready to see it live?",
    ])("renders the '%s' heading", (heading) => {
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
    });
  });

  describe("Feature grid (6 features)", () => {
    it.each([
      ["chat-based scorecard generation", /Chat/i],
      ["generative UI", /Generative UI/i],
      ["PDF export", /PDF/i],
      ["universal transcript ingestion", /transcript/i],
      ["EEOC-compliant / bias-reducing", /EEOC/i],
      ["team collaboration", /collaboration/i],
    ])("renders a feature referencing %s", (_label, keyword) => {
      expect(screen.getAllByText(keyword).length).toBeGreaterThan(0);
    });
  });

  describe("How it works (3 steps)", () => {
    it.each([
      "Paste your job description",
      "Watch the scorecard stream live",
      "Export to PDF or share with your team",
    ])("renders the step '%s'", (step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  describe("Primary CTA — View live product", () => {
    it("appears twice (hero row + closing band)", () => {
      const links = screen.getAllByRole("link", {
        name: /View live product/i,
      });
      expect(links).toHaveLength(2);
    });

    it("links to https://waffle.cards with safe new-tab attributes", () => {
      const links = screen.getAllByRole("link", {
        name: /View live product/i,
      });
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "https://waffle.cards");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("carries amber-fill + zinc-950 text contrast classes", () => {
      const links = screen.getAllByRole("link", {
        name: /View live product/i,
      });
      links.forEach((link) => {
        expect(link.className).toEqual(expect.stringContaining("bg-amber-600"));
        expect(link.className).toEqual(
          expect.stringContaining("text-zinc-950"),
        );
      });
    });

    it("fires trackEvent('waffle_view_live', ...) on click", () => {
      const [link] = screen.getAllByRole("link", {
        name: /View live product/i,
      });
      fireEvent.click(link);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        "waffle_view_live",
        "waffle_product_page",
        "View live product CTA",
      );
    });
  });

  describe("Secondary CTA — Try free", () => {
    it("appears twice (hero row + closing band)", () => {
      const links = screen.getAllByRole("link", { name: "Try free" });
      expect(links).toHaveLength(2);
    });

    it("links to https://app.waffle.cards/sign-up with safe new-tab attributes", () => {
      const links = screen.getAllByRole("link", { name: "Try free" });
      links.forEach((link) => {
        expect(link).toHaveAttribute(
          "href",
          "https://app.waffle.cards/sign-up",
        );
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("fires trackEvent('waffle_try_free', ...) on click", () => {
      const [link] = screen.getAllByRole("link", { name: "Try free" });
      fireEvent.click(link);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        "waffle_try_free",
        "waffle_product_page",
        "Try free CTA",
      );
    });
  });

  describe("Accent contrast proof", () => {
    it("the hero Live Product badge uses amber fill + zinc-950 text (never white)", () => {
      const badge = screen.getByText("Live Product");
      expect(badge.className).toEqual(expect.stringContaining("bg-amber-600"));
      expect(badge.className).toEqual(
        expect.stringContaining("text-zinc-950"),
      );
      expect(badge.className).not.toEqual(
        expect.stringContaining("text-white"),
      );
    });
  });

  describe("Back-to-projects nav", () => {
    it("renders a link back to /projects", () => {
      const link = screen.getByRole("link", { name: /Back to Projects/i });
      expect(link).toHaveAttribute("href", "/projects");
    });
  });
});
