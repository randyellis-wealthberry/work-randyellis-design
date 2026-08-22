/**
 * Waffle case study page.
 *
 * The page renders through `components/case-study/case-study-template.tsx`, so
 * these tests describe what a reader (or a screen reader) actually gets: the
 * claim, the lead, the two outbound product actions and the analytics they
 * fire, the "How it runs" sequence, and the proof figures.
 *
 * Deliberately NOT asserted: Tailwind utility classes. The previous suite
 * pinned `bg-amber-600` / `text-zinc-950` onto the CTAs and the badge, which
 * made every visual revision a test failure without protecting any behavior.
 */

import { render, screen, fireEvent, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import WaffleClientPage from "@/app/projects/waffle/waffle-client";

expect.extend(toHaveNoViolations);

// motion/react and @vercel/analytics are globally mocked via jest.config.js
// moduleNameMapper (root __mocks__/) — no inline mock needed for those.

// The template wraps each media figure in `InView`, which resolves
// `motion.figure`; the shared motion mock only defines a fixed element list, so
// the wrapper is stubbed down to the element it was asked to render. Same
// approach as __tests__/components/ui/global-case-study-grid.test.tsx.
jest.mock("@/components/motion-primitives/in-view", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InView: ({ children, as: Component = "div" }: any) => (
    <Component>{children}</Component>
  ),
}));

const mockTrackEvent = jest.fn();

// Only trackEvent is swapped; the rest of the module stays real so the
// template's own analytics imports resolve to the genuine functions.
jest.mock("@/lib/analytics", () => ({
  ...jest.requireActual("@/lib/analytics"),
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

const LIVE_URL = "https://waffle.cards";
const SIGNUP_URL = "https://app.waffle.cards/sign-up";

/** Both actions appear twice: once under the lead, once in the closing band. */
const ACTIONS = [
  {
    name: "View the live product",
    pattern: /View the live product/i,
    href: LIVE_URL,
    event: "waffle_view_live",
    label: "View live product CTA",
  },
  {
    name: "Try it free",
    pattern: /Try it free/i,
    href: SIGNUP_URL,
    event: "waffle_try_free",
    label: "Try free CTA",
  },
] as const;

const STEPS = [
  {
    title: "Paste the job description",
    description: /the only required input/i,
  },
  {
    title: "Watch the scorecard build",
    description: /stream in as interactive components/i,
  },
  {
    title: "Export it, or hand it to the panel",
    description: /print-ready PDF for the ATS record/i,
  },
] as const;

/** Figure plus the line that says what the figure counts. */
const PROOF = [
  ["2–4 min", "From job description to a complete scorecard"],
  ["6.2", /Average competencies per scorecard from the chat flow/i],
  ["11:1", /Recruiters who preferred the chat flow to a form/i],
  ["+23%", /Conversion after removing prompt editing/i],
] as const;

describe("Waffle case study page", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
    render(<WaffleClientPage />);
  });

  describe("Opening", () => {
    it("leads with the product's claim as the page's only h1", () => {
      const headings = screen.getAllByRole("heading", { level: 1 });

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(
        "Interview scorecards, written before the panel meets.",
      );
    });

    it("states in the lead that Waffle is live, paid, and built end to end", () => {
      expect(
        screen.getByText(
          /a live, paid AI product I designed and built end to end/i,
        ),
      ).toBeInTheDocument();
    });

    it("says how long a scorecard takes in the lead", () => {
      expect(
        screen.getByText(/the rubric streams back in two to four minutes/i),
      ).toBeInTheDocument();
    });

    it("offers a breadcrumb back to the projects index", () => {
      const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });

      expect(
        within(breadcrumb).getByRole("link", { name: "Projects" }),
      ).toHaveAttribute("href", "/projects");
    });
  });

  describe.each(ACTIONS)(
    "Outbound action — $name",
    ({ pattern, href, event, label }) => {
      it("is offered twice: under the lead and again in the closing band", () => {
        expect(screen.getAllByRole("link", { name: pattern })).toHaveLength(2);
      });

      it(`points at ${href}`, () => {
        for (const link of screen.getAllByRole("link", { name: pattern })) {
          expect(link).toHaveAttribute("href", href);
        }
      });

      it("opens in a new tab without handing the opener to the destination", () => {
        for (const link of screen.getAllByRole("link", { name: pattern })) {
          expect(link).toHaveAttribute("target", "_blank");

          const rel = link.getAttribute("rel") ?? "";
          expect(rel).toEqual(expect.stringContaining("noopener"));
          expect(rel).toEqual(expect.stringContaining("noreferrer"));
        }
      });

      it("warns assistive tech that it leaves the page", () => {
        for (const link of screen.getAllByRole("link", { name: pattern })) {
          expect(link).toHaveAccessibleName(
            expect.stringContaining("opens in a new tab"),
          );
        }
      });

      it(`fires trackEvent("${event}") from either copy`, () => {
        const links = screen.getAllByRole("link", { name: pattern });

        links.forEach((link, index) => {
          fireEvent.click(link);
          expect(mockTrackEvent).toHaveBeenCalledTimes(index + 1);
          expect(mockTrackEvent).toHaveBeenLastCalledWith(
            event,
            "waffle_product_page",
            label,
          );
        });
      });
    },
  );

  describe("How it runs", () => {
    it("names the sequence", () => {
      expect(
        screen.getByRole("heading", { level: 2, name: "How it runs" }),
      ).toBeInTheDocument();
    });

    it.each(STEPS)("renders the step '$title'", ({ title, description }) => {
      expect(
        screen.getByRole("heading", { level: 3, name: title }),
      ).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it("keeps the three steps in order — the sequence is the product", () => {
      const ordered = screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent ?? "")
        .filter((text) => STEPS.some((step) => text.endsWith(step.title)));

      expect(ordered).toHaveLength(STEPS.length);
      STEPS.forEach((step, index) => {
        // Each step is numbered; the digit is aria-hidden, so it shows up in
        // textContent but never in the accessible name.
        expect(ordered[index]).toBe(`${index + 1}${step.title}`);
      });
    });
  });

  describe("Proof", () => {
    it("names the section", () => {
      expect(
        screen.getByRole("heading", { level: 2, name: "What it produced" }),
      ).toBeInTheDocument();
    });

    it.each(PROOF)(
      "reports %s with the line that explains it",
      (value, context) => {
        // The figure counts up, so its digits are split across nodes; the
        // accessible label always carries the whole value.
        expect(screen.getByLabelText(value)).toBeInTheDocument();
        expect(screen.getByText(context)).toBeInTheDocument();
      },
    );

    it("says where the figures came from rather than leaving them bare", () => {
      expect(
        screen.getByText(
          /Figures from the product's own instrumentation and from pre-launch testing with twelve recruiters/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Regression guard — the old marketing page is gone", () => {
    it.each([
      "Live Product",
      "Key Features",
      "How It Works",
      "See it in action",
      "Ready to see it live?",
    ])("no longer renders '%s'", (removed) => {
      expect(screen.queryByText(removed)).not.toBeInTheDocument();
    });
  });
});

describe("Waffle case study page — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<WaffleClientPage />);

    expect(await axe(container)).toHaveNoViolations();
  }, 30000);
});
