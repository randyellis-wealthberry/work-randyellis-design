import React from "react";
import { render, screen, within } from "@testing-library/react";
import HomePage from "@/app/page";

/**
 * The homepage makes one argument: a claim, what the work has been worth, the
 * work itself, how the engagement runs, someone else's word for it, the
 * objections, the ask. This suite tests that shape.
 *
 * It replaces a suite that tested the homepage's use of TextGradientScroll —
 * two keyword paragraphs rendered as per-word scroll reveals, both removed when
 * the page was rewritten. Testing that integration would now test nothing.
 */

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("@/lib/analytics", () => ({
  trackProjectHover: jest.fn(),
  trackProjectView: jest.fn(),
  trackContactIntent: jest.fn(),
}));

jest.mock("@/components/booking/cal-embed", () => ({
  CalButton: ({ children, className }: any) => (
    <button className={className}>{children}</button>
  ),
}));

jest.mock("@/components/client-logos", () => ({
  ClientLogos: () => <div data-testid="client-logos" />,
}));

describe("Home page argument", () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it("leads with a real h1 carrying the claim", () => {
    const headings = screen.getAllByRole("heading", { level: 1 });

    // The previous page hid its h1 in sr-only and set the visible title as a
    // paragraph under an eyebrow, so the document had no heading at all.
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(
      "Design leader who ships AI products",
    );
  });

  it("states the proof figures in the markup rather than counting up to them", () => {
    // The True Figure First Rule: a figure already on screen never renders zero
    // and animates back.
    ["500M+", "$500M+", "2000+", "4"].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("anchors every section it labels", () => {
    ["proof", "work", "retainer", "recommendation", "questions"].forEach(
      (id) => {
        const section = document.getElementById(id);
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute("aria-labelledby", `${id}-heading`);
        expect(document.getElementById(`${id}-heading`)).toBeInTheDocument();
      },
    );
  });

  it("shows three case studies and a route to the rest", () => {
    const work = document.getElementById("work")!;
    const projectLinks = within(work)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/projects/"));

    expect(projectLinks).toHaveLength(3);
    expect(within(work).getByText(/All \d+ case studies/)).toBeInTheDocument();
  });

  it("asks for the call twice — under the lead and in the close — and nowhere else", () => {
    // The Action Row spec allows the close to restate the page's action. What
    // it does not allow is a third primary, which the previous page shipped.
    const asks = screen.getAllByRole("button", {
      name: /Book a 30-minute call/,
    });
    expect(asks).toHaveLength(2);
  });

  it("keeps the questions a founder asks before booking", () => {
    const questions = document.getElementById("questions")!;

    [
      "What's your approach to AI in design?",
      "How do you bridge design and development?",
      "What's your experience with scaling products?",
      "How do you approach product leadership?",
    ].forEach((question) => {
      expect(within(questions).getByText(question)).toBeInTheDocument();
    });
  });

  it("marks every outbound link as leaving the site", () => {
    const outbound = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(outbound.length).toBeGreaterThan(0);
    outbound.forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("(opens in a new tab)");
    });
  });
});
