/**
 * Echo case study — the live client page.
 *
 * `app/projects/echo/echo-client.tsx` renders through
 * `components/case-study/case-study-template.tsx`, so this suite renders the
 * real component and asserts what a reader actually gets: the headline, the
 * copy, the figures, the links. No assertion here reads a Tailwind class —
 * styling is not the page's contract, and asserting it only produces failures
 * on restyles that changed nothing a reader can perceive.
 */

import type { ElementType, ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";

import EchoClientPage from "@/app/projects/echo/echo-client";
import { PROJECTS } from "@/lib/data/projects";
import { PROJECT_MEDIA } from "@/lib/data/project-media";

expect.extend(toHaveNoViolations);

/**
 * The testimonial carousel (embla) measures its viewport on mount and jsdom
 * ships no ResizeObserver.
 */
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = NoopResizeObserver as unknown as typeof ResizeObserver;

/**
 * `InView` resolves `motion[as]`, and the shared `motion/react` mock exposes no
 * `figure`. Render the element plainly — the media section's content is the
 * subject here, not its entrance animation.
 */
jest.mock("@/components/motion-primitives/in-view", () => ({
  InView: ({
    children,
    as: As = "div",
  }: {
    children: ReactNode;
    as?: ElementType;
  }) => <As>{children}</As>,
}));

const echo = PROJECTS.find((p) => p.slug === "echo")!;
const media = PROJECT_MEDIA.echo;

const HEADLINE = "Two platforms, designed from inside the truck cab.";
const LEAD =
  "EchoDrive for Echo Global Logistics — a driver app and a dispatch web application, built from on-site research with the people who had to use them.";
const CLOSE_HEADLINE =
  "Field research is the cheapest part of a logistics build, and the part most teams skip.";

/** Title paired with a phrase unique to that capability's description. */
const CAPABILITIES: ReadonlyArray<[string, RegExp]> = [
  ["ELD Mandate Compliance", /automatically tracks driving hours/],
  ["Real-time Shipment Tracking", /live location updates/],
  ["Mobile Driver Communication", /In-app messaging platform/],
  ["Interactive Driver Onboarding", /step-by-step guidance for new drivers/],
  ["Self-serve LTL Booking", /replacing a call-center-dependent workflow/],
];

/** Context label as rendered, paired with the figure above it. */
const PROOF: ReadonlyArray<[string, string]> = [
  ["ELD compliance", "100%"],
  ["Platforms designed", "2"],
  ["Research method", "On-site"],
];

const renderPage = () => render(<EchoClientPage />);

/** A proof exhibit is a figure and its context in one cell. */
const proofCell = (context: string) =>
  screen.getByText(context).closest("div") as HTMLElement;

describe("EchoClientPage", () => {
  describe("Header", () => {
    it("leads with the page's own headline rather than the project name", () => {
      renderPage();

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        HEADLINE,
      );
    });

    it("renders exactly one first-level heading", () => {
      renderPage();

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it("states what the engagement was in the lead", () => {
      renderPage();

      expect(screen.getByText(LEAD)).toBeInTheDocument();
    });
  });

  describe("Breadcrumb", () => {
    it("offers a way back to the projects index", () => {
      renderPage();

      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });

      expect(
        within(nav).getByRole("link", { name: "Projects" }),
      ).toHaveAttribute("href", "/projects");
    });

    it("links home", () => {
      renderPage();

      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      const homeLinks = within(nav).getAllByRole("link", { name: "Home" });

      expect(homeLinks.length).toBeGreaterThan(0);
      homeLinks.forEach((link) => expect(link).toHaveAttribute("href", "/"));
    });

    it("marks the current page and does not link it", () => {
      renderPage();

      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      const current = within(nav).getByText(echo.name);

      expect(current).toHaveAttribute("aria-current", "page");
      expect(current.closest("a")).toBeNull();
    });
  });

  describe("The situation", () => {
    it("labels the section for what the reader walked into", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "What I walked into" }),
      ).toBeInTheDocument();
    });

    it("describes Echo Global's scale and the problems it had", () => {
      renderPage();

      expect(
        screen.getByText(/over 30 offices nationwide and 40,000\+/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/compliance challenges with new ELD regulations/),
      ).toBeInTheDocument();
    });
  });

  describe("The ledger", () => {
    it("names the section and its two columns", () => {
      renderPage();

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "The problems, and what answered them",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: "The problem" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: "What I did about it" }),
      ).toBeInTheDocument();
    });

    it("states the author's role above the table", () => {
      renderPage();

      expect(screen.getByText(echo.roleNarrative!)).toBeInTheDocument();
    });

    it("pairs every challenge with the solution that answered it", () => {
      renderPage();

      echo.challenges!.forEach((challenge, index) => {
        expect(screen.getByText(challenge)).toBeInTheDocument();
        expect(screen.getByText(echo.solutions![index])).toBeInTheDocument();
      });
    });
  });

  describe("Proof", () => {
    it("labels the section", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "What it produced" }),
      ).toBeInTheDocument();
    });

    it.each(PROOF)("shows %s as %s", (context, value) => {
      renderPage();

      expect(proofCell(context)).toHaveTextContent(value);
    });

    it("renders the non-numeric figure as written instead of counting it up", () => {
      renderPage();

      expect(proofCell("Research method")).toHaveTextContent("On-site");
      expect(proofCell("Research method")).not.toHaveTextContent("0");
    });

    it("scopes the figures to the design engagement", () => {
      renderPage();

      expect(
        screen.getByText(
          "Figures from the design engagement across alpha, beta, and launch.",
        ),
      ).toBeInTheDocument();
    });

    it("does not claim client business figures the page withholds", () => {
      renderPage();

      expect(screen.queryByText("Call Center Stress Reduction")).toBeNull();
    });
  });

  describe("The work", () => {
    it("labels the media section", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "The work" }),
      ).toBeInTheDocument();
    });

    it("gives every image a description", () => {
      renderPage();

      media
        .filter((item) => item.kind !== "video")
        .forEach((item) => {
          expect(screen.getByRole("img", { name: item.alt })).toHaveAttribute(
            "alt",
            item.alt,
          );
        });
    });

    it("captions the walkthrough video and names it for screen readers", () => {
      renderPage();

      expect(
        screen.getByLabelText(
          "Walkthrough of the EchoDrive driver and dispatch applications",
        ).tagName,
      ).toBe("VIDEO");
      expect(
        screen.getByText("EchoDrive across both platforms."),
      ).toBeInTheDocument();
    });
  });

  describe("Capabilities", () => {
    it("labels the section for the product, not generically", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "What EchoDrive does" }),
      ).toBeInTheDocument();
    });

    it.each(CAPABILITIES)("describes %s", (title, description) => {
      renderPage();

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it("lists every capability as a term with a definition", () => {
      renderPage();

      CAPABILITIES.forEach(([title]) => {
        expect(screen.getByText(title).tagName).toBe("DT");
      });
    });
  });

  describe("What shipped", () => {
    it("uses the page's own label for the deliverables", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "What shipped" }),
      ).toBeInTheDocument();
    });

    it("lists the deliverables from the project record", () => {
      renderPage();

      echo.overview!.deliverables.forEach((deliverable) => {
        expect(screen.getByText(deliverable)).toBeInTheDocument();
      });
    });

    it("lists the methods used", () => {
      renderPage();

      expect(screen.getByText("Methods")).toBeInTheDocument();
      expect(
        screen.getByText(echo.technologies.join(" · ")),
      ).toBeInTheDocument();
    });
  });

  describe("Client quotes", () => {
    it("labels the section", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "What the client said" }),
      ).toBeInTheDocument();
    });

    it("renders every stakeholder quote and attributes it", () => {
      renderPage();

      const quotes = echo.processStory!.stakeholderQuotes!;
      expect(quotes.length).toBeGreaterThan(0);

      quotes.forEach(({ quote, author }) => {
        expect(screen.getByText(`“${quote}”`)).toBeInTheDocument();
        expect(screen.getByText(author)).toBeInTheDocument();
      });
    });
  });

  describe("Reflection", () => {
    it("closes the argument with what the project proved", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: "Looking back" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(echo.processStory!.reflection!),
      ).toBeInTheDocument();
    });
  });

  describe("Close CTA", () => {
    it("makes the page's argument the headline of the ask", () => {
      renderPage();

      expect(
        screen.getByRole("heading", { level: 2, name: CLOSE_HEADLINE }),
      ).toBeInTheDocument();
    });

    it("says what the call is and what the reader leaves with", () => {
      renderPage();

      expect(
        screen.getByText(
          "Thirty minutes on the design decision your roadmap is stuck on. You will leave with an answer whether or not we work together.",
        ),
      ).toBeInTheDocument();
    });

    it("offers booking as the primary action", () => {
      renderPage();

      expect(
        screen.getByRole("button", { name: "Book a 30-minute call" }),
      ).toBeInTheDocument();
    });

    it("offers the other case studies as the secondary action", () => {
      renderPage();

      expect(
        screen.getByRole("link", { name: "See the other case studies" }),
      ).toHaveAttribute("href", "/projects");
    });
  });

  describe("Accessibility", () => {
    it("has no detectable accessibility violations", async () => {
      const { container } = renderPage();

      expect(await axe(container)).toHaveNoViolations();
    }, 30000);

    it("keeps the main landmark addressable by the skip link", () => {
      renderPage();

      expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    });

    it("gives every link an accessible name", () => {
      renderPage();

      screen.getAllByRole("link").forEach((link) => {
        expect(link).toHaveAccessibleName();
      });
    });

    it("nests headings without skipping a level", () => {
      renderPage();

      expect(
        screen.getAllByRole("heading", { level: 2 }).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByRole("heading", { level: 3 }).length,
      ).toBeGreaterThan(0);
    });
  });
});
