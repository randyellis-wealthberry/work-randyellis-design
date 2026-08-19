import { render, screen } from "@testing-library/react";
import ProjectsClient from "@/app/projects/projects-client";
import { PROJECTS } from "@/lib/data/projects";
import { existsSync } from "fs";
import { join } from "path";

// motion/react is globally mocked via jest.config.js moduleNameMapper
// (__mocks__/motion/react.js) — no inline mock needed here.
// Intentionally NOT mocking @/lib/data/projects — this test asserts on the
// real Waffle entry and the real grid render.

describe("Waffle grid card — data shape", () => {
  it("has exactly one entry with slug 'waffle'", () => {
    const waffleEntries = PROJECTS.filter((p) => p.slug === "waffle");
    expect(waffleEntries).toHaveLength(1);
  });

  it("the waffle entry has isLiveProduct === true", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(waffle?.isLiveProduct).toBe(true);
  });

  it("the waffle entry has id === 'waffle'", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(waffle?.id).toBe("waffle");
  });

  it("the waffle entry has name === 'Waffle'", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(waffle?.name).toBe("Waffle");
  });

  it("the waffle entry's thumbnail is the brand illustration and the file exists", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    // History: screenshot.png (marketing mock) → dashboard.png (2026-08-16,
    // real signed-in dashboard) → hero-thumbnail.webp (2026-08-18, orange
    // "WAFFLE" brand illustration). dashboard.png stays in the gallery.
    expect(waffle?.thumbnail).toBe("/projects/waffle/hero-thumbnail.webp");
    expect(existsSync(join(process.cwd(), "public", waffle!.thumbnail!))).toBe(
      true,
    );
  });

  it("the waffle entry has a non-empty longDescription", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(typeof waffle?.longDescription).toBe("string");
    expect(waffle?.longDescription.length).toBeGreaterThan(0);
  });

  it("the waffle entry has a boolean featured field", () => {
    const waffle = PROJECTS.find((p) => p.slug === "waffle");
    expect(typeof waffle?.featured).toBe("boolean");
  });

  it("regression guard: the echo entry does not carry isLiveProduct === true", () => {
    const echo = PROJECTS.find((p) => p.slug === "echo");
    expect(echo).toBeDefined();
    expect(echo?.isLiveProduct).not.toBe(true);
  });
});

describe("Waffle grid card — render", () => {
  beforeEach(() => {
    render(<ProjectsClient />);
  });

  it("renders a 'Live Product' badge exactly once", () => {
    expect(screen.getAllByText("Live Product")).toHaveLength(1);
  });

  it("renders a link to /projects/waffle", () => {
    const links = screen.getAllByRole("link", {
      name: /Waffle/i,
    });
    const waffleLink = links.find(
      (link) => link.getAttribute("href") === "/projects/waffle",
    );
    expect(waffleLink).toBeDefined();
  });
});
