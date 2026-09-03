import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import HireAiRandyPage from "@/app/hire-ai-randy/page";
import { DIMENSIONS, OVERALL_VERDICTS } from "@/lib/data/diagnostic";
import { trackContactIntent, trackEvent } from "@/lib/analytics";

/**
 * The diagnostic is the step between finding the site and booking a call:
 * twelve questions, one dimension at a time, a scored verdict, and only then
 * the ask. This suite walks that path.
 */

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("@/lib/analytics", () => ({
  trackContactIntent: jest.fn(),
  trackEvent: jest.fn(),
}));

jest.mock("@/components/booking/cal-embed", () => ({
  CalButton: ({
    children,
    className,
    onClick,
  }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

/** Choose the option at `optionIndex` for every question on the current step. */
function answerCurrentStep(optionIndex: number) {
  const groups = screen.getAllByRole("radiogroup");
  groups.forEach((group) => {
    const radios = within(group).getAllByRole("radio");
    fireEvent.click(radios[optionIndex]);
  });
}

function next() {
  fireEvent.click(
    screen.getByRole("button", { name: /^Next: |See the verdict/ }),
  );
}

/** Index of the option scoring `score` on every question in `dimension`. */
function indexScoring(dimensionIndex: number, score: number): number[] {
  return DIMENSIONS[dimensionIndex].questions.map((q) =>
    q.options.findIndex((o) => o.score === score),
  );
}

describe("Hire AI Randy diagnostic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
    Element.prototype.scrollIntoView = jest.fn();
    render(<HireAiRandyPage />);
  });

  it("leads with one h1 and the first dimension", () => {
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Hire AI Randy");
    expect(
      screen.getByRole("heading", { level: 2, name: DIMENSIONS[0].name }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(3);
  });

  it("does not ask for the call before the verdict", () => {
    expect(
      screen.queryByRole("button", { name: /Book a 30-minute call/ }),
    ).not.toBeInTheDocument();
  });

  it("refuses to advance until all three questions are answered", () => {
    next();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Answer all three to continue.",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: DIMENSIONS[0].name }),
    ).toBeInTheDocument();

    answerCurrentStep(0);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    next();
    expect(
      screen.getByRole("heading", { level: 2, name: DIMENSIONS[1].name }),
    ).toBeInTheDocument();
  });

  it("keeps answers when stepping back", () => {
    answerCurrentStep(1);
    next();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    const groups = screen.getAllByRole("radiogroup");
    groups.forEach((group) => {
      expect(within(group).getAllByRole("radio")[1]).toBeChecked();
    });
  });

  it("scores the best answers as ships and then asks for the call once", () => {
    for (let step = 0; step < DIMENSIONS.length; step += 1) {
      const groups = screen.getAllByRole("radiogroup");
      const indices = indexScoring(step, 3);
      groups.forEach((group, i) => {
        fireEvent.click(within(group).getAllByRole("radio")[indices[i]]);
      });
      next();
    }

    expect(
      screen.getByRole("heading", { level: 2, name: "The verdict" }),
    ).toBeInTheDocument();
    expect(screen.getByText(OVERALL_VERDICTS.ships.title)).toBeInTheDocument();

    const table = screen.getByRole("table", {
      name: "Ship-readiness score by dimension",
    });
    expect(within(table).getByText("36 / 36")).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", { name: /Book a 30-minute call/ }),
    ).toHaveLength(1);
    expect(trackEvent).toHaveBeenCalledWith(
      "diagnostic_complete",
      "engagement",
      "ships",
      36,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Book a 30-minute call/ }),
    );
    expect(trackContactIntent).toHaveBeenCalledWith(
      "booking",
      expect.any(String),
      "diagnostic_results",
    );
  });

  it("names the weakest dimension as the place to start", () => {
    for (let step = 0; step < DIMENSIONS.length; step += 1) {
      // Everything ships except the third dimension, which stalls.
      const indices = indexScoring(step, step === 2 ? 0 : 3);
      const groups = screen.getAllByRole("radiogroup");
      groups.forEach((group, i) => {
        fireEvent.click(within(group).getAllByRole("radio")[indices[i]]);
      });
      next();
    }
    expect(screen.getByText(`${DIMENSIONS[2].name}.`)).toBeInTheDocument();
    expect(screen.getByText(DIMENSIONS[2].sprint)).toBeInTheDocument();
    expect(screen.getByText(DIMENSIONS[2].verdicts.stalls)).toBeInTheDocument();
  });

  it("persists progress in session storage and can start over", () => {
    answerCurrentStep(2);
    next();
    const saved = JSON.parse(
      window.sessionStorage.getItem("hire-ai-randy:diagnostic") ?? "null",
    );
    expect(saved.step).toBe(1);
    expect(Object.keys(saved.answers)).toHaveLength(3);

    for (let step = 1; step < DIMENSIONS.length; step += 1) {
      answerCurrentStep(2);
      next();
    }
    fireEvent.click(
      screen.getByRole("button", { name: /Start the diagnostic over/ }),
    );
    expect(
      screen.getByRole("heading", { level: 2, name: DIMENSIONS[0].name }),
    ).toBeInTheDocument();
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });
});
