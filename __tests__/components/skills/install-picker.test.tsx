import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useReducedMotion } from "motion/react";
import { InstallPicker } from "@/components/skills/install-picker";
import { AGENT_COUNT, SKILL_AGENTS } from "@/lib/data/skill-agents";

const REPO = "randyellis-wealthberry/skills";
const reducedMotion = useReducedMotion as unknown as jest.Mock;

beforeEach(() => {
  reducedMotion.mockReturnValue(false);
});

describe("InstallPicker — default state", () => {
  it("opens on Claude Code, showing its path", () => {
    render(<InstallPicker />);

    expect(screen.getByText(".claude/skills/")).toBeInTheDocument();
  });

  it("types the command out on arrival", () => {
    jest.useFakeTimers();
    try {
      render(<InstallPicker />);

      // Nothing typed yet — the animation is what a first-time visitor sees.
      expect(
        screen.queryByText(`npx skills@latest add ${REPO} -a claude-code`),
      ).not.toBeInTheDocument();

      // Two stages: the first advance fires the start-delay timeout, and only
      // once React commits that state does the per-character interval exist.
      act(() => {
        jest.advanceTimersByTime(500);
      });
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(
        screen.getByText(`npx skills@latest add ${REPO} -a claude-code`),
      ).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it("renders the command immediately when motion is reduced", () => {
    reducedMotion.mockReturnValue(true);
    render(<InstallPicker />);

    expect(
      screen.getByText(`npx skills@latest add ${REPO} -a claude-code`),
    ).toBeInTheDocument();
  });

  it("marks exactly one chip as pressed", () => {
    render(<InstallPicker />);

    const pressed = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");

    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent("Claude Code");
  });

  it("advertises the real agent count", () => {
    render(<InstallPicker />);

    expect(
      screen.getByText(`# ${AGENT_COUNT} agents. One command.`),
    ).toBeInTheDocument();
    expect(AGENT_COUNT).toBe(SKILL_AGENTS.length);
  });
});

describe("InstallPicker — picking an agent", () => {
  it("swaps the command and the install path", () => {
    render(<InstallPicker />);

    fireEvent.click(screen.getByRole("button", { name: "Cursor" }));

    expect(
      screen.getByText(`npx skills@latest add ${REPO} -a cursor`),
    ).toBeInTheDocument();
    // Cursor installs to the shared .agents/ directory, not a vendor path.
    expect(screen.getByText(".agents/skills/")).toBeInTheDocument();
    expect(
      screen.queryByText(`npx skills@latest add ${REPO} -a claude-code`),
    ).not.toBeInTheDocument();
  });

  it("moves the pressed state to the chosen chip", () => {
    render(<InstallPicker />);

    fireEvent.click(screen.getByRole("button", { name: "Codex" }));

    expect(screen.getByRole("button", { name: "Codex" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Claude Code" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("InstallPicker — full agent list", () => {
  it("stays collapsed until asked", () => {
    render(<InstallPicker />);

    const toggle = screen.getByRole("button", {
      name: `Show all ${AGENT_COUNT} agents`,
    });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("reveals every agent when expanded", () => {
    render(<InstallPicker />);

    fireEvent.click(
      screen.getByRole("button", { name: `Show all ${AGENT_COUNT} agents` }),
    );

    const table = screen.getByRole("table");
    // One row per agent, plus the header row.
    expect(within(table).getAllByRole("row")).toHaveLength(AGENT_COUNT + 1);
  });
});

describe("InstallPicker — accessibility", () => {
  it("hides the word art from assistive tech", () => {
    const { container } = render(<InstallPicker />);

    const art = container.querySelector('[aria-hidden="true"]');
    expect(art).toBeInTheDocument();
    expect(art?.textContent).toContain("█");
  });
});
