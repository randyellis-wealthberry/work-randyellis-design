import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";

describe("Enhanced Projects Data Validation", () => {
  describe("Enhanced GrowIt! Project", () => {
    let growItProject: Project;

    beforeAll(() => {
      growItProject = PROJECTS.find((p) => p.id === "growit")!;
    });

    test("GrowIt! project exists and has enhanced data", () => {
      expect(growItProject).toBeDefined();
      expect(growItProject.id).toBe("growit");
      expect(growItProject.name).toBe("GrowIt!");
      expect(growItProject.category).toBe("Mobile App");
    });

    test("GrowIt! has comprehensive metrics", () => {
      expect(growItProject.metrics).toBeDefined();
      expect(growItProject.metrics!.length).toBeGreaterThanOrEqual(4);

      // Should have the new comprehensive metrics
      const metricLabels = growItProject.metrics!.map((m) => m.label);
      expect(metricLabels).toContain("Total Users");
      expect(metricLabels).toContain("Photo Ratings");
      expect(metricLabels).toContain("Photo Uploads");
      expect(metricLabels).toContain("Cities Served");
    });

    test("GrowIt! has development phases in processStory", () => {
      expect(growItProject.processStory).toBeDefined();
      expect(growItProject.processStory!.keyInsights).toBeDefined();
      expect(
        growItProject.processStory!.keyInsights!.length,
      ).toBeGreaterThanOrEqual(3);

      // Should mention the 3 development phases
      const insights = growItProject.processStory!.keyInsights!.join(" ");
      expect(insights.toLowerCase()).toMatch(/(phase|community|engagement)/);
    });

    test("GrowIt! has Ball Horticultural partnership details", () => {
      expect(growItProject.processStory!.background).toBeDefined();
      expect(growItProject.processStory!.background!.toLowerCase()).toMatch(
        /ball.*horticultural/,
      );
    });

    test("GrowIt! has proper tags for filtering", () => {
      expect(growItProject.tags).toBeDefined();
      expect(growItProject.tags).toContain("Social Platform");
      expect(growItProject.tags).toContain("Gardening");
      expect(growItProject.tags).toContain("Community");
      expect(growItProject.tags).toContain("Geolocation");
    });

    test("GrowIt! maintains existing video and thumbnail", () => {
      expect(growItProject.video).toBe(
        "/projects/growit/growit-hero-video.mp4",
      );
      expect(growItProject.thumbnail).toBe(
        "/projects/growit/hero-thumbnail.jpg",
      );
    });

    test("GrowIt! has enhanced images array", () => {
      expect(growItProject.images).toBeDefined();
      expect(growItProject.images.length).toBeGreaterThanOrEqual(6);

      // Should include phase-specific images
      const hasPhaseImages = growItProject.images.some(
        (img) =>
          img.includes("phase1-") ||
          img.includes("phase2-") ||
          img.includes("phase3-"),
      );
      expect(hasPhaseImages).toBe(true);
    });
  });

  describe("New Oh!Plays Project", () => {
    let ohPlaysProject: Project;

    beforeAll(() => {
      ohPlaysProject = PROJECTS.find((p) => p.id === "ohplays")!;
    });

    test("Oh!Plays project exists with correct basic data", () => {
      expect(ohPlaysProject).toBeDefined();
      expect(ohPlaysProject.id).toBe("ohplays");
      expect(ohPlaysProject.name).toBe("Oh!Plays");
      expect(ohPlaysProject.category).toBe("Mobile App");
      expect(ohPlaysProject.slug).toBe("ohplays");
    });

    test("Oh!Plays has proper video and thumbnail paths", () => {
      expect(ohPlaysProject.video).toBe(
        "/projects/ohplays/ohplays-hero-video.mp4",
      );
      expect(ohPlaysProject.thumbnail).toBeDefined();
      expect(ohPlaysProject.thumbnail).toMatch(/^\/projects\/ohplays\//);
    });

    test("Oh!Plays has user testing methodology in processStory", () => {
      expect(ohPlaysProject.processStory).toBeDefined();
      expect(ohPlaysProject.processStory!.methodology).toBeDefined();
      expect(ohPlaysProject.processStory!.methodology!.toLowerCase()).toMatch(
        /15.*high.*school.*student/,
      );
      expect(ohPlaysProject.processStory!.methodology!.toLowerCase()).toMatch(
        /(ios|android)/,
      );
    });

    test("Oh!Plays has student testimonials", () => {
      expect(ohPlaysProject.processStory!.stakeholderQuotes).toBeDefined();
      expect(
        ohPlaysProject.processStory!.stakeholderQuotes!.length,
      ).toBeGreaterThanOrEqual(3);

      // Should have student testimonials
      const quotes = ohPlaysProject.processStory!.stakeholderQuotes!;
      const hasStudentQuotes = quotes.some(
        (q) =>
          q.role.toLowerCase().includes("student") ||
          q.role.toLowerCase().includes("junior") ||
          q.role.toLowerCase().includes("senior") ||
          q.role.toLowerCase().includes("freshman") ||
          q.role.toLowerCase().includes("sophomore"),
      );
      expect(hasStudentQuotes).toBe(true);
    });

    test("Oh!Plays has user testing metrics", () => {
      expect(ohPlaysProject.metrics).toBeDefined();
      expect(ohPlaysProject.metrics!.length).toBeGreaterThanOrEqual(3);

      const metricLabels = ohPlaysProject.metrics!.map((m) => m.label);
      expect(
        metricLabels.some((label) => label.toLowerCase().includes("success")),
      ).toBe(true);
      expect(
        metricLabels.some((label) => label.toLowerCase().includes("editing")),
      ).toBe(true);
      expect(
        metricLabels.some((label) => label.toLowerCase().includes("recommend")),
      ).toBe(true);
    });

    test("Oh!Plays has proper tags for sports and video editing", () => {
      expect(ohPlaysProject.tags).toBeDefined();
      expect(ohPlaysProject.tags).toContain("Sports");
      expect(ohPlaysProject.tags).toContain("Video Editing");
      expect(ohPlaysProject.tags).toContain("Social Sharing");
      expect(ohPlaysProject.tags).toContain("User Testing");
      expect(ohPlaysProject.tags).toContain("Mobile Development");
    });

    test("Oh!Plays has comprehensive images including demos", () => {
      expect(ohPlaysProject.images).toBeDefined();
      expect(ohPlaysProject.images.length).toBeGreaterThanOrEqual(5);

      // Should include app demo images and interface screenshots
      const hasAppDemo = ohPlaysProject.images.some((img) =>
        img.includes("app-demo"),
      );
      const hasInterface = ohPlaysProject.images.some((img) =>
        img.includes("interface"),
      );
      expect(hasAppDemo || hasInterface).toBe(true);
    });

    test("Oh!Plays has proper timeline and status", () => {
      expect(ohPlaysProject.timeline).toMatch(/2017/);
      expect(ohPlaysProject.status).toBe("completed");
    });

    test("Oh!Plays has Eight Bit Studios development details", () => {
      expect(ohPlaysProject.processStory!.background).toBeDefined();
      expect(ohPlaysProject.processStory!.background!.toLowerCase()).toMatch(
        /eight.*bit.*studios/,
      );
    });
  });

  describe("Project Filtering Validation", () => {
    test("both enhanced projects are in Mobile App category", () => {
      const mobileAppProjects = PROJECTS.filter(
        (p) => p.category === "Mobile App",
      );

      const growItExists = mobileAppProjects.some((p) => p.id === "growit");
      const ohPlaysExists = mobileAppProjects.some((p) => p.id === "ohplays");

      expect(growItExists).toBe(true);
      expect(ohPlaysExists).toBe(true);
    });

    test("projects maintain proper structure for filtering", () => {
      const testProjects = ["growit", "ohplays"];

      testProjects.forEach((projectId) => {
        const project = PROJECTS.find((p) => p.id === projectId);
        expect(project).toBeDefined();
        expect(project!.category).toBeDefined();
        expect(project!.tags).toBeDefined();
        expect(project!.tags.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Asset Path Validation", () => {
    test("GrowIt! asset paths are valid", () => {
      const growItProject = PROJECTS.find((p) => p.id === "growit")!;

      expect(growItProject.video.startsWith("/projects/growit/")).toBe(true);
      expect(growItProject.thumbnail!.startsWith("/projects/growit/")).toBe(
        true,
      );

      growItProject.images.forEach((img) => {
        expect(img.startsWith("/projects/growit/")).toBe(true);
      });
    });

    test("Oh!Plays asset paths are valid", () => {
      const ohPlaysProject = PROJECTS.find((p) => p.id === "ohplays")!;

      expect(ohPlaysProject.video.startsWith("/projects/ohplays/")).toBe(true);
      expect(ohPlaysProject.thumbnail!.startsWith("/projects/ohplays/")).toBe(
        true,
      );

      ohPlaysProject.images.forEach((img) => {
        expect(img.startsWith("/projects/ohplays/")).toBe(true);
      });
    });
  });
});
