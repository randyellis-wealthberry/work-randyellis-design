import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { GlobalMobileMenu } from "@/components/ui/global-mobile-menu";
import { MobileMenuProvider } from "@/context/mobile-menu-context";

const push = jest.fn();
let mockPathname = "/projects";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push, prefetch: jest.fn(), replace: jest.fn() }),
}));

const setTheme = jest.fn();
let mockResolvedTheme: "light" | "dark" = "light";
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    resolvedTheme: mockResolvedTheme,
    setTheme,
  }),
}));

jest.mock("@/lib/analytics", () => ({
  trackEvent: jest.fn(),
  trackThemeToggle: jest.fn(),
}));

function renderMenu() {
  return render(
    <MobileMenuProvider>
      <GlobalMobileMenu />
    </MobileMenuProvider>,
  );
}

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
}

beforeEach(() => {
  push.mockClear();
  setTheme.mockClear();
  mockPathname = "/projects";
  mockResolvedTheme = "light";
  window.localStorage.clear();
});

describe("GlobalMobileMenu — trigger", () => {
  it("renders a closed trigger wired to the dialog id", () => {
    renderMenu();
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).toHaveAttribute("aria-controls", "mobile-menu");
    expect(btn).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("GlobalMobileMenu — open state", () => {
  it("opens as a labelled modal dialog with the four site links", () => {
    renderMenu();
    openMenu();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    // aria-labelledby must point at an element that actually exists
    const titleId = dialog.getAttribute("aria-labelledby")!;
    expect(document.getElementById(titleId)).toHaveTextContent(/menu/i);

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    for (const label of ["Home", "About", "Projects", "Blog"]) {
      expect(nav).toHaveTextContent(label);
    }
  });

  it("marks the current route with aria-current", () => {
    mockPathname = "/projects/growit";
    renderMenu();
    openMenu();
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    const projects = Array.from(nav.querySelectorAll("a")).find(
      (a) => a.textContent === "Projects",
    )!;
    const home = Array.from(nav.querySelectorAll("a")).find(
      (a) => a.textContent === "Home",
    )!;
    expect(projects).toHaveAttribute("aria-current", "page");
    expect(home).not.toHaveAttribute("aria-current");
  });

  it("closes on the close button, on the backdrop, and on Escape", () => {
    renderMenu();

    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openMenu();
    fireEvent.click(document.querySelector('[aria-hidden="true"].fixed')!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openMenu();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when a navigation link is clicked", () => {
    renderMenu();
    openMenu();
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    fireEvent.click(
      Array.from(nav.querySelectorAll("a")).find((a) => a.textContent === "About")!,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("locks body scroll while open and restores it on close", () => {
    renderMenu();
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("GlobalMobileMenu — theme toggle", () => {
  it("labels the toggle from the *resolved* theme, not the raw setting", () => {
    // theme is "system"; resolvedTheme decides what the button says
    mockResolvedTheme = "dark";
    renderMenu();
    openMenu();
    const toggle = screen.getByRole("button", { name: /switch to light theme/i });
    expect(toggle).toHaveTextContent(/light mode/i);
    fireEvent.click(toggle);
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});

describe("GlobalMobileMenu — search", () => {
  it("shows results for a query and navigates on selection", () => {
    renderMenu();
    openMenu();
    const input = screen.getByRole("combobox", { name: /search the site/i });
    fireEvent.change(input, { target: { value: "waffle" } });

    const list = screen.getByRole("listbox", { name: /search results/i });
    const options = list.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]).toHaveTextContent(/waffle/i);

    fireEvent.click(options[0]);
    expect(push).toHaveBeenCalledWith("/projects/waffle");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Enter opens the highlighted result; arrows move the highlight", () => {
    renderMenu();
    openMenu();
    const input = screen.getByRole("combobox", { name: /search the site/i });
    fireEvent.change(input, { target: { value: "design" } });
    const options = screen
      .getByRole("listbox", { name: /search results/i })
      .querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(1);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(push).toHaveBeenCalledWith(options[1].getAttribute("href"));
  });

  it("shows an empty state for no matches and clears on Escape before closing the menu", () => {
    renderMenu();
    openMenu();
    const input = screen.getByRole("combobox", { name: /search the site/i });
    fireEvent.change(input, { target: { value: "zzqxvplorf" } });
    expect(screen.getByRole("status")).toHaveTextContent(/no matches/i);

    // First Escape clears the query but keeps the menu open
    fireEvent.keyDown(input, { key: "Escape" });
    expect((input as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("GlobalMobileMenu — recent pages", () => {
  it("lists previously visited pages, excluding the current one", async () => {
    // Simulate a prior visit to /about, then land on /projects
    window.localStorage.setItem(
      "re:recent-pages",
      JSON.stringify([{ href: "/about", title: "About" }]),
    );
    renderMenu();
    await act(async () => {});
    openMenu();
    const recent = screen.getByText(/recently viewed/i).parentElement!;
    expect(recent).toHaveTextContent("About");
    expect(recent.querySelectorAll("a")).toHaveLength(1);
  });
});
