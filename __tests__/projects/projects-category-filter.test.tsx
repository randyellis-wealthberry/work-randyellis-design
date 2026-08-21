import { render, screen } from "@testing-library/react";
import ProjectsClient from "@/app/projects/projects-client";
import type { Project } from "@/lib/data/types";

// Mock motion components to avoid animation issues in tests
jest.mock("motion/react", () => ({
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock project data with exactly 3 projects for clear test expectations
const MOCK_PROJECTS: Project[] = [
  {
    id: "alpha",
    name: "Alpha App",
    slug: "alpha",
    description: "Mobile app test project",
    longDescription: "Long description for Alpha App",
    category: "Mobile App",
    categories: ["Mobile App"],
    tags: ["Gardening"],
    link: "https://example.com/alpha",
    video: "/alpha-video.mp4",
    images: [],
    timeline: "2024",
    status: "completed",
    technologies: ["React Native"],
    featured: true,
  },
  {
    id: "beta",
    name: "Beta Web",
    slug: "beta",
    description: "Web app test project",
    longDescription: "Long description for Beta Web",
    category: "Web App",
    tags: ["Dashboard"],
    link: "https://example.com/beta",
    video: "/beta-video.mp4",
    images: [],
    timeline: "2024",
    status: "completed",
    technologies: ["Next.js"],
    featured: true,
  },
  {
    id: "gamma",
    name: "Gamma",
    slug: "gamma",
    description: "Design system test project",
    longDescription: "Long description for Gamma",
    category: "Design System",
    categories: ["UI/UX"],
    tags: [],
    link: "https://example.com/gamma",
    video: "/gamma-video.mp4",
    images: [],
    timeline: "2024",
    status: "completed",
    technologies: ["Figma"],
    featured: false,
  },
];

jest.mock("@/lib/data/projects", () => ({
  PROJECTS: MOCK_PROJECTS,
}));

describe("Projects Category Filter", () => {
  describe("when category query param is set", () => {
    beforeEach(() => {
      // Mock next/navigation for category=mobile app
      jest.resetModules();
      jest.doMock("next/navigation", () => ({
        useSearchParams: () => new URLSearchParams("category=mobile app"),
      }));
    });

    afterEach(() => {
      jest.unmock("next/navigation");
    });

    test("shows only matching project (Alpha App)", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      // Should show Alpha App (matches "Mobile App" category)
      expect(screen.getByText("Alpha App")).toBeInTheDocument();

      // Should NOT show Beta Web or Gamma
      expect(screen.queryByText("Beta Web")).not.toBeInTheDocument();
      expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
    });

    test("shows status line with count", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      // Should show "Showing 1 project matching..."
      expect(screen.getByText(/Showing 1 project/i)).toBeInTheDocument();
    });

    test("shows clear filter link", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      const clearLink = screen.getByRole("link", { name: /clear filter/i });
      expect(clearLink).toBeInTheDocument();
      expect(clearLink).toHaveAttribute("href", "/projects");
    });
  });

  describe("when category query param matches nothing", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock("next/navigation", () => ({
        useSearchParams: () => new URLSearchParams("category=zzz"),
      }));
    });

    afterEach(() => {
      jest.unmock("next/navigation");
    });

    test("shows no project cards", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      expect(screen.queryByText("Alpha App")).not.toBeInTheDocument();
      expect(screen.queryByText("Beta Web")).not.toBeInTheDocument();
      expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
    });

    test('shows "No projects match" message', () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      expect(screen.getByText(/No projects match/i)).toBeInTheDocument();
    });

    test("shows clear filter link", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      const clearLink = screen.getByRole("link", { name: /clear filter/i });
      expect(clearLink).toBeInTheDocument();
      expect(clearLink).toHaveAttribute("href", "/projects");
    });
  });

  describe("when useSearchParams returns null (no router context)", () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock("next/navigation", () => ({
        useSearchParams: () => null,
      }));
    });

    afterEach(() => {
      jest.unmock("next/navigation");
    });

    test("shows all projects", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      expect(screen.getByText("Alpha App")).toBeInTheDocument();
      expect(screen.getByText("Beta Web")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();
    });

    test("does not show status line or clear link", () => {
      const { default: ProjectsClient } = require("@/app/projects/projects-client");
      render(<ProjectsClient />);

      expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /clear filter/i })).not.toBeInTheDocument();
    });
  });
});

describe("Projects Page Source Assertions", () => {
  test("page.tsx contains Suspense wrapping ProjectsClient", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    expect(pageSource).toContain("<Suspense");
    expect(pageSource).toContain("<ProjectsClient");
  });

  test("page.tsx imports Suspense from react", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    expect(pageSource).toMatch(/import.*Suspense.*from ['"]react['"]/);
  });

  test("page.tsx uses buildBreadcrumbSchema", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    expect(pageSource).toContain("buildBreadcrumbSchema(");
  });

  test("page.tsx imports from @/components/seo/json-ld", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    expect(pageSource).toMatch(
      /import.*from ['"]@\/components\/seo\/json-ld['"]/,
    );
  });

  test("page.tsx does not import structured-data", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    expect(pageSource).not.toContain("structured-data");
  });

  test("page.tsx does not contain hardcoded https://work.randyellis.design URLs", () => {
    const pageSource = require("fs").readFileSync(
      require("path").join(__dirname, "../../app/projects/page.tsx"),
      "utf-8",
    );

    // Should use WEBSITE_URL constant, not hardcoded URLs
    expect(pageSource).not.toContain("https://work.randyellis.design");
  });
});
